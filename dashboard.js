import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function initDashboard(){

  const { data: { session } } = await supabase.auth.getSession()

  if(!session){
    window.location.href = "login.html"
    return
  }

  console.log("User logged in:", session.user.email)

  loadMetrics()

}

initDashboard()


async function loadMetrics(){

  const { data, error } = await supabase
  .from("campaign_reports")
  .select("sales_7d,cost,orders_7d")

  if(error){
    console.log(error)
    return
  }

  let sales = 0
  let spend = 0
  let orders = 0

  data.forEach(row => {

    sales += row.sales_7d || 0
    spend += row.cost || 0
    orders += row.orders_7d || 0

  })

  document.getElementById("sales").innerText = sales.toFixed(2)
  document.getElementById("spend").innerText = spend.toFixed(2)
  document.getElementById("orders").innerText = orders

}

window.logout = async function(){

  const { error } = await supabase.auth.signOut()

  if(error){
    alert("Logout error: " + error.message)
    return
  }

  window.location.href = "login.html"

}

<script type="module" src="amazon_oauth.js"></script>
<script type="module" src="dashboard.js"></script>
