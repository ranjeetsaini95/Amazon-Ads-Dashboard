import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://YOUR_PROJECT.supabase.co',
  'YOUR_ANON_KEY'
)

async function initDashboard(){

  const { data: { user } } = await supabase.auth.getUser()

  if(!user){
    window.location.href = "login.html"
    return
  }

  loadProfiles()
  loadMetrics()

}

initDashboard()


async function loadProfiles(){

  const { data, error } = await supabase
  .from("amazon_profiles")
  .select("*")

  if(error){
    console.error(error)
    return
  }

  const select = document.getElementById("profileSelect")

  data.forEach(profile => {

    const option = document.createElement("option")

    option.value = profile.profile_id
    option.text = profile.profile_id

    select.appendChild(option)

  })

}


async function loadMetrics(){

  const { data, error } = await supabase
  .from("campaign_reports")
  .select("sales_7d,cost,orders_7d,clicks,impressions")

  if(error){
    console.error(error)
    return
  }

  let sales = 0
  let spend = 0
  let orders = 0
  let clicks = 0
  let impressions = 0

  data.forEach(row => {

    sales += row.sales_7d || 0
    spend += row.cost || 0
    orders += row.orders_7d || 0
    clicks += row.clicks || 0
    impressions += row.impressions || 0

  })

  document.getElementById("sales").innerText = sales.toFixed(2)
  document.getElementById("spend").innerText = spend.toFixed(2)
  document.getElementById("orders").innerText = orders

}
