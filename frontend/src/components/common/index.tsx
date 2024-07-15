import moment from "moment";
import { defaultLocale } from "../../constants/defaultLocale.ts";
import { createFilterOptions } from "@mui/material";

export const currency = (num: number | bigint) => {
  const result = new Intl.NumberFormat(defaultLocale().currencyLangCode, {
    style: 'currency',
    currency: defaultLocale().currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: defaultLocale().fractionDigits,
    maximumFractionDigits: defaultLocale().fractionDigits,
  }).format(num).replace(/CA/g, '');
  return result;
};

export const formatFromDate = (date: string | Date) => {
  const formatedDate = moment(new Date(date))
    .format('MM-DD-YYYY');
  return formatedDate;
};

export const formatYearFromDate = (date: string) => {
  const formatedDate = moment(date).format('YYYY');
  return formatedDate;
};