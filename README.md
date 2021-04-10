# ethers-provider-flashbots-bundle

## How to start sending your bundles to the Archer Relay
The only change you need to make to start sending your bundles to the Archer relay is to pass in the Archer relay URL when you call "FlashbotsBundleProvider.create" like so:
```
const flashbotsProvider = await FlashbotsBundleProvider.create(provider, authSigner, 'https://api.archerdao.io/v1/bundle')
```
See [demo.ts](/src/demo.ts) for an example.

## More info
[See our docs](https://docs.archerdao.io/for-suppliers/archer-relay) for more details about Archer Relay
