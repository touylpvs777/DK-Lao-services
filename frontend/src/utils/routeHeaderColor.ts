/**
 * Every module's page header banner shares the DK Lao logo navy with a red
 * bottom edge, matching the Dashboard's main banner.
 */
const HEADER_BANNER_CLASS = 'bg-[linear-gradient(135deg,#213b89_0%,#162a6b_100%)] shadow-[inset_0_-4px_0_0_#e62e2d]'

export function getHeaderColorClass(_pathname: string): string {
  return HEADER_BANNER_CLASS
}
