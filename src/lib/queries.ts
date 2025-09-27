import { gql } from '@apollo/client';

// Query for Uniswap swaps from the last 7 days
export const GET_UNISWAP_SWAPS = gql`
  query GetUniswapSwaps($timestamp: Int!) {
    swaps(
      where: { timestamp_gte: $timestamp }
      orderBy: timestamp
      orderDirection: desc
      first: 1000
    ) {
      id
      timestamp
      origin
      amountUSD
      gasUsed
    }
  }
`;

// Query for SushiSwap swaps from the last 7 days
export const GET_SUSHISWAP_SWAPS = gql`
  query GetSushiSwapSwaps($timestamp: Int!) {
    swaps(
      where: { timestamp_gte: $timestamp }
      orderBy: timestamp
      orderDirection: desc
      first: 1000
    ) {
      id
      timestamp
      origin
      amountUSD
      gasUsed
    }
  }
`;

// Query for Uniswap daily aggregated data
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

// Query for SushiSwap daily aggregated data
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

// Helper function to get timestamp for 7 days ago
export const getSevenDaysAgoTimestamp = (): number => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return Math.floor(sevenDaysAgo.getTime() / 1000);
};

// Helper function to get timestamp for 14 days ago
export const getFourteenDaysAgoTimestamp = (): number => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  return Math.floor(fourteenDaysAgo.getTime() / 1000);
};
