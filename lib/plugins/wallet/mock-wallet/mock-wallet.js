const BN = require('../../../bn')
const E = require('../../../error')

const NAME = 'FakeWallet'

const SECONDS = 1000
const PUBLISH_TIME = 3 * SECONDS
const AUTHORIZE_TIME = 8 * SECONDS
const CONFIRM_TIME = 60 * SECONDS

let t0

function balance (account, cryptoCode) {
  return Promise.resolve()
  .then(() => {
    if (cryptoCode === 'BTC') return BN(1e8 * 10)
    if (cryptoCode === 'ETH') return BN(1e18 * 10)
    throw new Error('Unsupported crypto: ' + cryptoCode)
  })
}

function isInsufficient (cryptoCode) {
  if (cryptoCode === 'BTC') return BN(1e5 * 10)
  if (cryptoCode === 'ETH') return BN(1e18 * 0.25)
  throw new Error('Unsupported crypto: ' + cryptoCode)
}
function sendCoins (account, toAddress, cryptoAtoms, cryptoCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('[%s] DEBUG: Mock wallet sending %s cryptoAtoms to %s',
        cryptoCode, cryptoAtoms.toString(), toAddress)
      if (isInsufficient(cryptoCode)) return reject(new E.InsufficientFundsError())
      return resolve('<txHash>')
    }, 2000)
  })
}

function newAddress () {
  t0 = Date.now()
  return Promise.resolve('<Fake address, don\'t send>')
}

function getStatus (account, toAddress, cryptoAtoms, cryptoCode) {
  const elapsed = Date.now() - t0

  if (elapsed < PUBLISH_TIME) return Promise.resolve({status: 'notSeen'})
  if (elapsed < AUTHORIZE_TIME) return Promise.resolve({status: 'published'})
  if (elapsed < CONFIRM_TIME) return Promise.resolve({status: 'authorized'})

  console.log('[%s] DEBUG: Mock wallet has confirmed transaction', cryptoCode)
  return Promise.resolve({status: 'confirmed'})
}

module.exports = {
  NAME,
  balance,
  sendCoins,
  newAddress,
  getStatus
}