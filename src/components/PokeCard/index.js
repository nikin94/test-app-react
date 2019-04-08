import React, { useEffect, useState } from 'react'
import { Tag, Card, Carousel, Button, Spin, Progress } from 'antd'
import { isNull } from 'util';

export default function PokeCard({ title, url }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sprites: {}, types: [], id: null });
  const [side, setSide] = useState(true);
  function getData(pokemon) {
    if (!loading) setLoading(true);
    fetch(pokemon).then((res) => {
      res.json().then((resp) => {
        setData(resp);
        setLoading(false);
      });
    });
  }
  function getCarousel(obj) {
    if (!obj.front_default) return <img alt={title} className="no-image" src="https://seeklogo.com/images/P/pokeball-logo-DC23868CA1-seeklogo.com.png" />
    let sprites = Object.entries(obj);
    for (let i = 0; i < 4; i++) {
      sprites.unshift(sprites.pop());
    }
    return (<div>
      <Carousel arrows={true}>
        {Object.values(sprites).map((value, index) => {
          return value[1] ? <img key={`${title}${index}`} alt={title} src={value[1]} /> : 0
        })}
      </Carousel>
    </div>);
  }
  function getStats(stats) {
    return (<div>
      {stats.map((value) => {
        return (<div className="stat"><p className="stat-name">{value.stat.name}</p><Progress key={value} showInfo={false} percent={value.base_stat / 2} /></div>)
      })}
    </div>);
  }

  function getTypes(arr) {
    return arr.map((value, index) => {
      return <Tag key={`${value}${index}`} className={`type ${value.type.name}`}>{value.type.name}</Tag>
    });
  }
  function printNumber(number) {
    if (number && !isNull(number)) {
      if (number >= 100) {
        return `№${number}`;
      } else if (number >= 10) {
        return `№0${number}`;
      } else {
        return `№00${number}`;
      }
    } else {
      return `loading...`;
    }
  }
  useEffect(() => {
    getData(url);
  }, [url]);

  return (

    <Card
      className="pokecard"
      extra={<Button type="primary" size='small' onClick={() => { setSide(!side) }}>{side ? 'Stats' : 'Close'}</Button>}
      cover={loading
        ? <Spin tip="Loading..." />
        : (side
          ? getCarousel(data.sprites)
          : getStats(data.stats)
        )
      }
    >
      <p className='number'>{printNumber(data.id)}</p>
      <p className="title">{title}</p>
      <div className="types">{getTypes(data.types)}</div>
    </Card>);
}