import { QueryLang } from '../types';

export function getQueryLang(query: string): {
  lang: QueryLang;
  query: string;
} {
  var querySegment = null;
  for (let l in QueryLang) {
    if (query.startsWith('@' + l)) {
      querySegment = { lang: l, query: query.replace('@' + l + ' ', '') };
      break;
    }
  }

  if (querySegment == null)
    return { lang: QueryLang.jmespath, query: query.trim() };

  const lang = querySegment.lang;
  const queryStr = querySegment.query;
  switch (lang) {
    case QueryLang.jmespath:
      return { lang: QueryLang.jmespath, query: queryStr };
    case QueryLang.jsonata:
      return { lang: QueryLang.jsonata, query: queryStr };
    default:
      throw new Error('Invalid query language: ' + lang);
  }
}
