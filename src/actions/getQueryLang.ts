import { QueryLang } from '../types';

export function getQueryLang(query: string): {
  lang: QueryLang;
  query: string;
} {
  const querySegment = query.split('@$');

  if (querySegment.length <= 1)
    return { lang: QueryLang.jmespath, query: query.trim() };

  const lang = querySegment[0].trim();
  const queryStr = querySegment[1].trim();
  switch (lang) {
    case QueryLang.jmespath:
      return { lang: QueryLang.jmespath, query: queryStr };
    case QueryLang.jsonata:
      return { lang: QueryLang.jsonata, query: queryStr };
    default:
      throw new Error('Invalid query language: ' + lang);
  }
}
