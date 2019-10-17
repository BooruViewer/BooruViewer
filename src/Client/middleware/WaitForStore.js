
export default function({ store }) {
  console.log('WaitForStore middleware!')
  if (store && store.restored)
    return store.restored
}
