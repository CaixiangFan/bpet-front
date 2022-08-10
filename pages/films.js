import React, {Component} from "react";
import axios from "axios";
import Image from "next/image";
import utilStyles from '../styles/utils.module.css';
import styles from '../components/layout.module.css';
import Link from "next/link";

export default class Films extends Component {
  static async getInitialProps() {
    const res = await axios.get('https://m.maizuo.com/gateway?cityId=110100&pageNum=1&pageSize=10&type=1&k=3024823',{
      headers: {
        'X-Host': 'mall.film-ticket.film.list'
      }
    });
    return {
      films: res.data.data.films
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Films</h2>
        <ul>
          {
            this.props.films.map(item => {
              return <li key={item.filmId}>
                {item.name}
              <br></br>
              <Link href={"https://m.maizuo.com/v5/?co=mzmovie#/film/"+item.filmId}>
                <a>
                  <Image 
                  priority
                  src={item.poster}
                  className={utilStyles.borderSquare}
                  height={108}
                  width={108}
                  />
                </a>
              </Link>
              </li>
            })
          }
        </ul>
      </div>
    )
  }
}