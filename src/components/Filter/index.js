import React from 'react'
import { Input, Tag } from 'antd'
import { observer } from 'mobx-react'

/*const colors = {
  normal: '#bbbaab',
  grass: '#8dd851',
  fire: '#fa5444',
  water: '#56aeff',
  fighting: '#a85644',
  flying: '#79a4ff',
  poison: '#aa5da1',
  ground: '#e9c956',
  rock: '#cdbc72',
  bug: '#c3d21f',
  ghost: '#7975d7',
  electric: '#fde53c',
  psychic: '#fa65b4',
  ice: '#96f1ff',
  dragon: '#8a75ff',
  dark: '#8e6956',
  steel: '#c4c2d9',
  fairy: '#faadff'
}*/


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
    //this.handleClick = this.handleClick.bind(this);
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
