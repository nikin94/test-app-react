import React from 'react'
import { PokeCard, Filter } from '../../components'
import { Pagination, Collapse } from 'antd'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import _cloneDeep from 'lodash/cloneDeep';

const URLpokemon = 'https://pokeapi.co/api/v2/pokemon/';
const URLtypes = 'https://pokeapi.co/api/v2/type/';
const Panel = Collapse.Panel;

let data = observable({
  count: 0,
  pageSize: 10,
  currentPage: 1,
  totalPokemons: [],
  filter: {
    search: '',
    types: [],
    pokemons: [],
    pokemonsByType: [],
    pokemonsBySearch: []
  }
})

data.onChangeSearch = action((value) => {
  data.currentPage = 1;
  data.filter.search = value;
  data.filter.pokemonsBySearch = data.totalPokemons.filter(name => {
    return name.toLowerCase().indexOf(data.filter.search) !== -1;
  });
  data.filter.types.length
    ? data.filter.pokemons = data.filter.pokemonsBySearch.filter(val => data.filter.pokemonsByType.includes(val))
    : data.filter.pokemons = data.filter.pokemonsBySearch;
  data.count = data.filter.pokemons.length;
});

data.onChangeTypes = action(async (e) => {
  let { types, search } = data.filter;
  const newTypes = _cloneDeep(types);
  newTypes.includes(e)
    ? newTypes.splice(newTypes.indexOf(e), 1)
    : newTypes.push(e);
  const pokemonWithTypes = [];
  for (let element of newTypes) {
    let res = await fetch(`${URLtypes}${element}`);
    res = await res.json();
    const pokeWithType = res.pokemon.map(elem => elem.pokemon.name);
    pokemonWithTypes.push(pokeWithType);
  }
  let fitleredPokemons = pokemonWithTypes[0] || data.totalPokemons;
  for (let i = 1; i <= pokemonWithTypes.length - 1; i++) {
    const newPoke = [];
    for (let pokeName of fitleredPokemons) {
      pokemonWithTypes[i].includes(pokeName) && newPoke.push(pokeName);
    }
    fitleredPokemons = newPoke;
  }
  data.filter.types = newTypes;
  data.filter.pokemonsByType = fitleredPokemons;
  if (search) {
    data.onChangeSearch(search);
  } else {
    data.count = fitleredPokemons.length;
    data.filter.pokemons = fitleredPokemons;
  }
});

data.onChangePage = action((value) => {
  data.currentPage = value;
});
data.onChangePagesize = action((value) => {
  data.pageSize = value;
});
data.onChangeCount = action((value) => {
  data.count = value;
});
data.setPokemons = action(() => {
  const url = `${URLpokemon}?offset=0&limit=999`;
  fetch(url).then((res) => {
    res.json().then((resp) => {
      const names = resp.results.map(e => e.name);
      data.totalPokemons = names;
      data.filter.pokemons = names;
      data.count = resp.count;
    })
  });
});

class Plist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { types: [] };
  }
  onPaginationChange = (e) => {
    data.onChangePage(e);
  };
  onPagesizeChange = (current, size) => {
    data.onChangePagesize(size);
  }

  componentDidMount() {
    data.setPokemons();
  }

  render() {
    return (<div className="container">
      <Collapse>
        <Panel showArrow={true} header="Filters">
          <Filter filterData={data} />
        </Panel>
      </Collapse>
      <Pagination onChange={this.onPaginationChange} showSizeChanger pageSizeOptions={['10', '20', '50']} onShowSizeChange={this.onPagesizeChange}
        defaultCurrent={1} current={data.currentPage} defaultPageSize={data.pageSize} total={data.count} />
      <div className='list'>
        {
          (data.filter.pokemons).map((name, index) => {
            if (index >= (data.currentPage - 1) * data.pageSize && index < data.currentPage * data.pageSize) {
              return <PokeCard key={`${name}${index}`} title={name} url={`${URLpokemon}${name}`} />
            }
          })
        }
      </div>

    </div>
    );
  }
}
export default observer(Plist);