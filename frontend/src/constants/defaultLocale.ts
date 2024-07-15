import token from '../utilities/index.tsx';

export enum ShowCurrencyFormat {
    symbol = 'symbol',
    countryWithSymbol = 'countryWithSymbol',
    currencyCode = 'currencyCode',
  }
  
  export enum DateStyleFormat {
    long = 'long',
    short = 'short',
  }
  
const getLocaleData = () =>
    JSON.parse(token.getStoreData('localeProperties') || '{}');

export const defaultLocale = () => {
    const result = {
      language:
        getLocaleData()?.language !== null &&
          getLocaleData()?.language !== undefined
          ? getLocaleData()?.language
          : 'en-US',
      currency:
        getLocaleData()?.currency !== null &&
          getLocaleData()?.currency !== undefined
          ? getLocaleData()?.currency
          : 'CAD',
      fractionDigits:
        getLocaleData()?.fractionDigits !== null &&
          getLocaleData()?.fractionDigits !== undefined
          ? getLocaleData()?.fractionDigits
          : 2,
      showCurrencyFormat: ShowCurrencyFormat.symbol,
      dateStyle: DateStyleFormat.short,
      dateLocale:
        getLocaleData()?.dateLocale !== null &&
          getLocaleData()?.dateLocale !== undefined
          ? getLocaleData()?.dateLocale
          : 'en',
      countryCode:
        getLocaleData()?.countryCode !== null &&
          getLocaleData()?.countryCode !== undefined
          ? getLocaleData()?.countryCode
          : 'CA',
      currencyLangCode:
        getLocaleData()?.currencyLangCode !== null &&
          getLocaleData()?.currencyLangCode !== undefined
          ? getLocaleData()?.currencyLangCode
          : 'en-US',
    };
    return result;
  };