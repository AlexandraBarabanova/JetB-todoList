import React, {Component} from 'react';
import List from '@jetbrains/ring-ui/components/list/list';
import Checkbox from '@jetbrains/ring-ui/components/checkbox/checkbox';
import Button from '@jetbrains/ring-ui/components/button/button';
import Pager from '@jetbrains/ring-ui/components/pager/pager';
import './TodoList.css';

class TodoItems extends Component {

  render() {
    const todoEntries = this.props.entries;
    const listItems = todoEntries.map(item => {
      if (this.props.filter === false || (this.props.filter === true && item.check === true)) {
        return (
          <div className={['list', item.check && 'check'].filter(e => !!e).join(' ')} key={item.key}>
            <Checkbox defaultChecked={item.check} onChange={this.props.markComplete.bind(this, item.key)}/>
            <List data={[item]}/>
            <Button danger type="submit" id={item.key} onClick={e => this.props.delItem(item.key, e)}>X</Button>
          </div>
        );
      }
    });
    return (
      <div className="theList">
        {todoEntries.length === 0 ? <span>Your to-do list is empty</span> : listItems}
        <Pager
          total={this.props.total}
          currentPage={this.props.currentPage}
          pageSize={15}
          visiblePagesLimit={5}
          disablePageSizeSelector
          onPageChange={this.props.pageChange}
        />
      </div>
    );
  }
}
export default TodoItems;
