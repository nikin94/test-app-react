import React from 'react'
import { Input, Tag } from 'antd'
import { observer } from 'mobx-react'

const { CheckableTag } = Tag;
const URL_TYPES = 'https://pokeapi.co/api/v2/type/';

class PokeTag extends React.Component {
  state = {
    checked: false,
    name: ''
  };

  handleChange = (checked) => {
    this.setState({ checked, name: this.props.children });
    this.props.onChange(this.props.children);
  }

  render() {
    return <CheckableTag {...this.props} checked={this.state.checked} onChange={this.handleChange} />;
  }
}

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { types: [] };
  }

  componentDidMount() {
    this.setTypes();
  }

  setTypes = () => {
    fetch(URL_TYPES).then((res) => {
      res.json().then((resp) => {
        this.setState({ types: resp.results });
      })
    });
  }

  onInputChange = (event) => {
    this.props.filterData.onChangeSearch(event.target.value);
  };

  render() {
    return (
      <div className="filter" >
        <Input placeholder="Filter pokemons by name" onChange={this.onInputChange} />
        <div className='types filter'>
          {this.state.types.map((value, index) => {
            return <PokeTag key={value.name} className={`${value.name} type filter-type`} onChange={this.props.filterData.onChangeTypes}>{value.name}</PokeTag>
          })}
        </div>
      </div>
    );
  }
};
export default observer(Filter);
