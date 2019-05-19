import React, {Component} from 'react';
import Header, {
  Logo,
  Tray,
  SmartProfile,
  SmartServices
} from '@jetbrains/ring-ui/components/header/header';
import Footer from '@jetbrains/ring-ui/components/footer/footer';

import TodoList from '../TodoList/TodoList';
import './app.css';
import TodoItems from '../TodoItems/TodoItems';

const pageCount = 15;
export default class AppRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentItem: {text: '', key: ''},
      inputElement: '',
      sort: localStorage.getItem('localSort') === 'true',
      sortAl: localStorage.getItem('localSortAl') === 'false' ? false : localStorage.getItem('localSortAl'),
      filter: localStorage.getItem('localFilter') === 'true',
      data: [],
      total: 0,
      currentPage: localStorage.getItem('currentPage') ? Number(localStorage.getItem('currentPage')) : 1
    };
    if (JSON.parse(localStorage.getItem('Item')) != undefined) {
      this.state.data = JSON.parse(localStorage.getItem('Item'));
    } else {
      try {
        this.state.data = require('./todo-list.json');
      } catch (error) {
        console.log('Файл не найден!');
      }
    }
    if (this.state.data.length !== 0) {
      this.state.total = this.state.data.length;
      const lenght = this.state.data.length > pageCount ? pageCount : this.state.data.length;
      for (let i = 0; i < lenght; i++) {
        this.state.items[i] = {label: this.state.data[i].label, key: this.state.data[i].key, check: this.state.data[i].check};
      }
    }
    this.state.sort = !this.state.sort;
    this.sortBy();

    switch (this.state.sortAl) {
      case 'asc': {
        this.state.sortAl = 'desc';
        this.sortABC();
        break;
      }
      case 'desc': {
        this.state.sortAl = 'asc';
        this.sortABC();
        break;
      }
    }
    this.pageChange(this.state.currentPage);
  }

  handleInput = e => {
    const itemText = e.target.value;
    const currentItem = {label: itemText, key: Date.now(), check: false};
    this.setState({
      currentItem,
      inputElement: currentItem.label
    });
  }

  addItem = e => {
    e.preventDefault();
    const newItem = this.state.currentItem;
    if (newItem.label !== '') {
      this.state.data.unshift(newItem);
      this.setState({
        data: this.state.data,
        currentItem: {text: '', key: ''},
        inputElement: '',
        total: this.state.data.length
      });
      this.pageChange(1);
      localStorage.setItem('Item', JSON.stringify(this.state.data));
    }
  }

  markComplete = id => {
    this.setState({
      data: this.state.data.map(item => {
        if (item.key === id) {
          item.check = !item.check;
        }
        return item;
      })
    });
    localStorage.setItem('Item', JSON.stringify(this.state.data));
    this.pageChange(this.state.currentPage);
  }

  sortBy = () => {
    this.state.sort = !this.state.sort;
    const data = this.state.data.sort((a, b) => a.key - b.key);
    if (this.state.sort) {
      data.reverse();
    }
    this.setState({
      data,
      sortAl: false,
      sort: this.state.sort
    });
    this.pageChange(this.state.currentPage);
    localStorage.setItem('localSort', this.state.sort);
    localStorage.setItem('localSortAl', false);
  };

  markFilter = () => {
    this.setState({
      filter: !this.state.filter
    });
    localStorage.setItem('localFilter', !this.state.filter);
    this.pageChange(1);
  }

  sortABC = () => {
    this.state.sortAl = this.state.sortAl === undefined ? 'desc' : this.state.sortAl === 'asc' ? 'desc' : 'asc';
    const data = this.state.data.sort((a, b) => {
      const nameA = a.label.toLowerCase(); const nameB = b.label.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    if (this.state.sortAl === 'desc') {
      data.reverse();
    }
    this.setState({
      data,
      sort: false
    });
    localStorage.setItem('localSort', false);
    localStorage.setItem('localSortAl', this.state.sortAl);
    this.pageChange(this.state.currentPage);
  }

  delItem = (elem, e) => {
    e.preventDefault();
    const index = this.state.data.findIndex(item => item.key === elem);
    this.state.data.splice(index, 1);
    const data = this.state.data;
    this.setState({
      data
    });
    localStorage.setItem('Item', JSON.stringify(this.state.data));
    this.pageChange(this.state.currentPage);
  }

  itemShow = (data, cp) => {
    this.state.items = [];
    const lenght = data.length > pageCount * cp ? pageCount * cp : data.length;
    for (let i = pageCount * (cp - 1); i < lenght; i++) {
      this.state.items[i - pageCount * (cp - 1)] = {label: data[i].label, key: data[i].key, check: data[i].check};
    }
    this.setState({
      items: this.state.items,
      currentPage: cp
    });
  }

  pageChange = cp => {
    if (localStorage.getItem('localFilter') === 'true') {
      const filterData = this.state.data.filter(item => item.check === true);
      this.state.total = filterData.length;
      this.itemShow(filterData, cp);
    } else {
      this.state.total = this.state.data.length;
      this.itemShow(this.state.data, cp);
    }
    localStorage.setItem('currentPage', cp);
  };

  render() {
    return (
      <div>
        <Header>
          <h1>
            Todo List
          </h1>
        </Header>
        <div className="app-content">
          <TodoList
            sortABC={this.sortABC}
            sortBy={this.sortBy}
            addItem={this.addItem}
            inputElement={this.state.inputElement}
            sortAl={this.state.sortAl}
            handleInput={this.handleInput}
            currentItem={this.state.currentItem}
            markFilter={this.markFilter}
            filter={this.state.filter}
          />
          <TodoItems
            entries={this.state.items}
            delItem={this.delItem}
            inputElement={this.state.inputElement}
            markComplete={this.markComplete}
            filter={this.state.filter}
            total={this.state.total}
            currentPage={this.state.currentPage}
            pageChange={this.pageChange}
          />
        </div>
        <Footer
          left={[
            'Enterprise 8.0.2 EAP (build 27448)'
          ]}
          center={[
            [{copyright: 2019, label: ' Todo List'}],
            {
              label: 'License agreement',
              title: 'read me!',
              target: '_blank'
            }
          ]}
          right={[
            {
              label: 'Feedback'
            }
          ]}
        />
      </div>
    );
  }
}

