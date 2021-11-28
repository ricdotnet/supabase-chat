const client = supabase.createClient("https://fpefdkqiasnojgxisabk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNzIzMjk0NSwiZXhwIjoxOTQyODA4OTQ1fQ.8jp3hypJTP-jqgOPaAyzZ5y8NRlLBh8aE553lj-RY4w")
client
  .from('messages')
  .on('INSERT', payload => {
    updateChats(payload)
  })
  .subscribe()

let messagesList = document.getElementById('messages')
let message = document.getElementById('message');

async function sendChat() {
  let username = document.getElementById('username').value;
  // let file = document.getElementById('file').files[0]
  
  // uploadFile(file)

  // return;

  if(!username)
    return alert('enter a username to send messages...')

  if(!message.value)
    return alert('enter a message...')

  let msg = message.value;
  badwords.forEach(el => {
    msg.replace(el, 'some')
  })

  const { data, error } = await client
    .from('messages')
    .insert([
      { user: username, message: message.value },
    ])

  if(error) {
    console.log('there was an error')
    return;
  }

  message.value = ''
}

async function uploadFile(file) {
  const { data } = await client
    .storage
    .from('photos')
    .upload(`chatapp/${Date.now()}-${file.name}`, file, {
      cacheControl: 3600,
      upsert: false
    })

    let url = data.Key.substring(7)

    const { publicURL, error } = client
    .storage
    .from('photos')
    .getPublicUrl(url)

    window.open(publicURL, '_blank')
}

function updateChats(data) {

  if(messagesList.length === 0)
    messagesList.textContent = ''

  let msgContent = data.new.message;

  let node = document.createElement('li')
  let text = document.createTextNode(data.new.user + ' -> ' + msgContent)
  node.appendChild(text)
  messagesList.prepend(node)
}

window.addEventListener('load', async (event) => {
  let { data: messages, error } = await client
    .from('messages')
    .select('*')
    .order('id', { ascending: false })

  if(messages.length < 1) {
    messagesList.textContent = 'no messages...'
  }

  messages.map(message => {
    let node = document.createElement('li')
    let text = document.createTextNode(message.user + ' -> ' + message.message)
    node.appendChild(text)
    messagesList.appendChild(node)
  })
})

badwords = ['fuck', 'bitch', 'shit', 'cunt'];

function badWords() {
  return new Promise((resolve, reject) => {
    
  })
}