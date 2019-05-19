import React, {Component} from 'react';

import Button from '@jetbrains/ring-ui/components/button/button';
import Input, {Size, Theme} from '@jetbrains/ring-ui/components/input/input';
import Checkbox from '@jetbrains/ring-ui/components/checkbox/checkbox';

import {
  Unsorted10pxIcon,
  CaretDown10pxIcon
} from '@jetbrains/ring-ui/components/icon';


class TodoList extends Component {
  render() {
    return (
      <div className="todoListMain">
        <div className="header">
          <div className="filterSort">
            <Checkbox defaultChecked={this.props.filter} onClick={this.props.markFilter}/>
            <Button onClick={this.props.sortBy} title="Сортировка по добавлению"><Unsorted10pxIcon className="ring-icon"/></Button>
            <Button onClick={this.props.sortABC} title="Сортировка по алфавиту">{this.props.sortAl === 'desc' ? 'A ' : 'Z '}<CaretDown10pxIcon className="ring-icon"/></Button>
          </div>
          <form onSubmit={this.props.addItem}>
            <Input
              label="Input Task"
              placeholder="Task"
              // ref={this.props.inputElement}
              value={this.props.inputElement}
              onChange={this.props.handleInput}
            />
            <Button type="submit">Add Task</Button>
          </form>
        </div>
      </div>
    );
  }
}

export default TodoList;
