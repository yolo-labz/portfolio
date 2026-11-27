# Obsolete asset fixtures

These exact historical files exercise rejection of older inputs. They are not the
current candidate, and the tests never change their bytes.

| Fixture | Source | SHA-256 |
| --- | --- | --- |
| `obsolete_portfolio_pr236_svg.bytes` | [Portfolio SVG](https://github.com/yolo-labz/portfolio/blob/8c2d97514c465f21eaf2037f2b62e7f584be8f2e/apps/web/public/brand/gremlin-typing.svg) | `a5acd648de2ca28c7422935f758483cc1d49be2bfe365c80809226c40219e609` |
| `obsolete_org_pr73_svg.bytes` | [Organization SVG](https://github.com/yolo-labz/.github/blob/eaef18ad5f0b1dbea1ec0d83949deb24d01a1666/design/brand/logo/gremlin-typing-v6.svg) | `a53011e8754692653294a7476db7363ba43c3f4f6524e70a5989d3c359bf77db` |
| `obsolete_portfolio_pr236_ico.bytes` | [Portfolio icon](https://github.com/yolo-labz/portfolio/blob/8c2d97514c465f21eaf2037f2b62e7f584be8f2e/apps/web/src/app/favicon.ico) | `45d2a5b047f5bb831ae6b74235ba9e58a4405d9f6c6b7dd70b8e2db1502d5a1a` |

The expected newer SVG and corrected ICO hashes are fixed in `scripts/preflight.mjs`
and the manifest template. Recover those exact inputs through the existing review
owner before attempting actual browser acceptance.
