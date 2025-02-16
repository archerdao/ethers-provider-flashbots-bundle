import { providers, Wallet } from 'ethers'
import { ConnectionInfo } from 'ethers/lib/utils'
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from './index'

const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'http://127.0.0.1:8545'
const FLASHBOTS_AUTH_KEY = process.env.FLASHBOTS_AUTH_KEY
const ARCHER_RELAY_URL = 'https://api.archerdao.io/v1/bundle'

const connection: ConnectionInfo = { url: ETHEREUM_RPC_URL }
const NETWORK_INFO = { chainId: 1, ensAddress: '', name: 'mainnet' }
const provider = new providers.JsonRpcProvider(connection, NETWORK_INFO)

provider.getBlockNumber().then(async (blockNumber) => {
  const authSigner = FLASHBOTS_AUTH_KEY ? new Wallet(FLASHBOTS_AUTH_KEY) : Wallet.createRandom()
  const flashbotsProvider = await FlashbotsBundleProvider.create(provider, authSigner, ARCHER_RELAY_URL)

  const wallet = Wallet.createRandom().connect(provider)

  const signedTransactions = await flashbotsProvider.signBundle([
    {
      signer: wallet,
      transaction: {
        to: wallet.address,
        gasPrice: 0
      }
    },
    {
      signedTransaction:
        '0xf85f8080825208947a76570ef1d933582c354cbc02c22415e243901880801ca0a0e5096067fa6a62874c9ea2bcc774f2dcf83fd73814db89258af9b4e66092d1a045410ddeda97315d5250d17461930edd6ad46be5351d70c9d02929a1cbd07645'
    }
  ])
  console.log({ signedTransactions })
  const simulation = await flashbotsProvider.simulate(signedTransactions, blockNumber + 1)

  // Using TypeScript discrimination
  if ('error' in simulation) {
    console.log(`Simulation Error: ${simulation.error.message}`)
  } else {
    console.log(`Simulation Success: ${JSON.stringify(simulation, null, 2)}`)
  }
  const bundleSubmission = await flashbotsProvider.sendRawBundle(signedTransactions, blockNumber + 1)
  console.log('bundle submitted, waiting')
  const waitResponse = await bundleSubmission.wait()
  const bundleSubmissionSimulation = await bundleSubmission.simulate()
  console.log({ bundleSubmissionSimulation, waitResponse: FlashbotsBundleResolution[waitResponse] })
})
