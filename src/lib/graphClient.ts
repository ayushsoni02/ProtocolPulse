import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const apiKey = process.env.NEXT_PUBLIC_GRAPH_API_KEY;
const uniswapSubgraphId = process.env.NEXT_PUBLIC_UNISWAP_SUBGRAPH_ID;
const sushiswapSubgraphId = process.env.NEXT_PUBLIC_SUSHISWAP_SUBGRAPH_ID;

if (!apiKey || !uniswapSubgraphId || !sushiswapSubgraphId) {
  console.warn('Missing Graph Protocol credentials. Using mock data.');
  // Fallback to mock data if credentials are missing
}

// Create HTTP links for both protocols with authentication
const createAuthenticatedLink = (subgraphId: string) => createHttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/${subgraphId}`,
  headers: apiKey ? {
    authorization: `Bearer ${apiKey}`
  } : {}
});

const uniswapHttpLink = uniswapSubgraphId ? createAuthenticatedLink(uniswapSubgraphId) : null;
const sushiswapHttpLink = sushiswapSubgraphId ? createAuthenticatedLink(sushiswapSubgraphId) : null;

// Create Apollo clients for both protocols (with fallback for missing credentials)
export const uniswapClient = uniswapHttpLink ? new ApolloClient({
  link: uniswapHttpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}) : null;

export const sushiswapClient = sushiswapHttpLink ? new ApolloClient({
  link: sushiswapHttpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}) : null;

// Retry logic wrapper
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error('Max retries exceeded');
};
