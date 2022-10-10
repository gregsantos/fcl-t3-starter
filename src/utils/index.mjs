import * as shared from './shared.mjs'
import * as fclUtils from './fcl.mjs'

export default function useUtils() {
  return { ...shared, ...fclUtils }
}
