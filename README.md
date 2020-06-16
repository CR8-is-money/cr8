# cr8 - Combining DAI return rates

![cr8 image](src/assets/boat-crate.svg)

cr8 is a framework for combining the returns of
[Compound cDAI](https://app.compound.finance/) and [CHAI](https://chai.money).
It allows you to `pack` DAI into CR8 and `unpack` CR8 to get DAI. While packed,
the DAI are split between cDAI and CHAI. Every time someone `pack`s or
`unpack`s, the contract observes the `crate` (its current rate of return), and
adjusts the ratio of its holdings to track a target combination of cDAI and
CHAI. As a result, cr8 smooths out the returns from CHAI and DAI.

The first cr8 instance (`CR8-SW`) tracks the Supply-Weighted average of the
`cDAI`. It weights the Compound rate by the current Compound DAI supply, and
the CHAI rate by the number of DAI locked in the DSR. A passive CR8-SW holder
can expect to make (approximately) the supply-weighted average of the two
rates.

The second cr8 instance (`CR8-BR`) tracks the Best Rate of CHAI and cDAI. It
weights 100% of the DAI allocation to the better rate.

## Bug Bounty

We are offering **ONE MILLION** kovan **ETH** as bug bounties. Each bug earns a
minimum of **50,000** kovan **ETH**, with more severe bugs earning more ETH.

To qualify, open an issue on this repo with bug details.

## Glossary

* `pack`      - Put DAI into cDAI and CHAI, receive newly minted CR8.
* `unpack`    - Burn CR8, retrieve DAI, pay a small dev fee.
* `cr8`       - The contracts and system.
* `CR8`       - The asset representing the `pack`ed DAI.
* `CR8-SW`    - Supply-Weighted CR8.
* `crate`     - The instance rate-of-return, as `(1+r) * 10**27`.
* `target`    - The target rate-of-return, as `(1+r) * 10**27`.
* `packedDAI` - The total amount of underlying DAI owned by the cr8 contract.
* `daiShare`  - The amount of packed dai belonging to an account


## Notes

* DSR returns are denominated per-second, while cDAI returns are per-block. cr8
   code adjusts for this
* DSR is expressed as `1 + rate`, while cDAI returns are expressed as `rate`.

## Project setup
```
npm install
```

## Frontend

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint

```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
