/**
 * The introductory loading overlay was removed by client direction.
 *
 * Keep the named component temporarily so both the deployed root layout and
 * the newer local site shell remain compatible while rendering no interstitial.
 */
export function LoadingScreen() {
  return null;
}
