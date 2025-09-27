import { gql } from '@apollo/client';

// Uniswap V3 query for Arbitrum
export const GET_UNISWAP_SWAPS = gql`
  query GetUniswapSwaps($timestamp: BigInt!) {
    swaps(
      where: { timestamp_gte: $timestamp }
      orderBy: timestamp
      orderDirection: desc
      first: 1000
    ) {
      id
      timestamp
      sender
      recipient
      amountUSD
      pool {
        id
      }
      transaction {
        id
      }
    }
  }
`;

// Fixed SushiSwap query - using String instead of BigInt
export const GET_SUSHISWAP_SWAPS = gql`
  query GetSushiSwapSwaps($timestamp: String!) {
    swaps(
      where: { timestamp_gte: $timestamp }
      orderBy: timestamp
      orderDirection: desc
      first: 1000
    ) {
      id
      timestamp
      sender: from
      to
      amountUSD
      transaction {
        id
      }
    }
  }
`;

// Keep your existing daily stats queries but fix the naming
export const GET_UNISWAP_DAILY_STATS = gql`
  query GetUniswapDailyStats($timestamp: Int!) {
    uniswapDayDatas(
      where: { date_gte: $timestamp }
      orderBy: date
      orderDirection: desc
      first: 14
    ) {
      date
      volumeUSD
      txCount
    }
  }
`;

export const GET_SUSHISWAP_DAILY_STATS = gql`
  query GetSushiSwapDailyStats($timestamp: Int!) {
    dayDatas(
      where: { date_gte: $timestamp }
      orderBy: date
      orderDirection: desc
      first: 14
    ) {
      date
      volumeUSD
      txCount
    }
  }
`;

// Keep your helper functions as they are
export const getSevenDaysAgoTimestamp = (): string => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return Math.floor(sevenDaysAgo.getTime() / 1000).toString();
};

export const getFourteenDaysAgoTimestamp = (): number => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  return Math.floor(fourteenDaysAgo.getTime() / 1000);
};