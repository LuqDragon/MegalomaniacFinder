import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeStats } from './schema/trade-stats';
import { Notable } from './schema/notable';
import { Observable } from 'rxjs';
import { StatByTradeStat } from './schema/stat-by-trade-stat';
import { Filter, TradeQuery } from './schema/trade-query';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  getTradeStats(): Observable<Notable[]> {
    return new Observable((observer) =>
      this.http
        .get<TradeStats>('./assets/tradeStats.json')
        .subscribe((response) => {
          observer.next(
            response.result
              .filter((result) => result.id === 'explicit')[0]
              .entries.filter((entry) =>
                entry.text.startsWith('1 Added Passive Skill is')
              )
              .map(
                (passive) =>
                  <Notable>{
                    name: passive.text.substring(24).trim(),
                    statId: passive.id,
                  }
              )
          );
        })
    );
  }

  getStatByTradeStat() {
    return this.http.get<Array<StatByTradeStat>>(
      './assets/statByTradeStat.json'
    );
  }

  generateTradeLinks(tradeId: string): Observable<string[]> {
    return new Observable((observer) =>
      this.getStatByTradeStat().subscribe((statsByTradeStats) => {
        let tradeQueries: TradeQuery[] = [];
        let tradeLinks: string[] = [];

        let selectedStat = statsByTradeStats.find(
          (statByTradeStat) => statByTradeStat.tradeId === tradeId
        );

        if (selectedStat === undefined)
          throw "This stat don't exists in reference data.";

        statsByTradeStats.sort((a, b) => a.statId - b.statId);

        let below = statsByTradeStats
          .filter(
            (statByTradeStat) => statByTradeStat.statId < selectedStat.statId
          )
          .map((statByTradeStat) => <Filter>{ id: statByTradeStat.tradeId });
        let above = statsByTradeStats
          .filter(
            (statByTradeStat) => statByTradeStat.statId > selectedStat.statId
          )
          .map((statByTradeStat) => <Filter>{ id: statByTradeStat.tradeId });

        if (below.length > 1) {
          this.splitArray(below).forEach((array) => {
            tradeQueries.push(this.generateTradeQuery(tradeId, array));
          });
        }

        if (above.length > 1) {
          this.splitArray(above).forEach((array) => {
            tradeQueries.push(this.generateTradeQuery(tradeId, array));
          });
        }

        tradeQueries.forEach((tradeQuery) =>
          tradeLinks.push(
            'https://www.pathofexile.com/trade/search/Keepers?q=' +
              encodeURIComponent(JSON.stringify(tradeQuery))
          )
        );

        observer.next(tradeLinks);
      })
    );
  }

  generateTradeQuery(tradeId: string, statsFilter: Filter[]) {
    return <TradeQuery>{
      query: {
        status: {
          option: 'securable',
        },
        stats: [
          { type: 'and', filters: [{ id: tradeId }] },
          { type: 'count', value: { min: 2 }, filters: statsFilter },
        ],
        name: 'Megalomaniac',
        type: 'Medium Cluster Jewel',
      },
      sort: {
        price: 'asc',
      },
    };
  }

  splitArray(array: Filter[]) {
    const chunkSize = 100;
    let chunks: Filter[][] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      let nextArray = array.slice(i, i + chunkSize * 2);

      if (nextArray.length != 0 && nextArray.length < 2) {
        chunks.push(array.slice(i, i + chunkSize + 1));

        continue;
      }

      chunks.push(array.slice(i, i + chunkSize));
    }

    return chunks;
  }
}
