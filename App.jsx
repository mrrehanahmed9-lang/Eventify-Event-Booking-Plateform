import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Search, Ticket, UserRound, LogOut, ArrowRight, Sparkles, Clock3, Menu, X } from 'lucide-react';
import { api, getToken } from './api';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const money = n => Number(n || 0) === 0 ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const dateLabel = d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const demoImages = {
  Music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=80',
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
  Art: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=80',
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
  Other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80'
};
const imageFor = e => e.imageUrl || demoImages[e.category] || demoImages.Other;

function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="nav wrap">
    <Link className="brand" to="/"><span className="brand-icon"><Sparkles size={20}/></span>eventify<span className="brand-dot">.</span></Link>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? 'nav-links show' : 'nav-links'}>
      <NavLink to="/" onClick={() => setOpen(false)}>Explore events</NavLink>
      {user && <NavLink to="/bookings" onClick={() => setOpen(false)}>My tickets</NavLink>}
      {user?.role === 'admin' && <NavLink to="/admin" onClick={() => setOpen(false)}>Manage events</NavLink>}
      {user ? <><span className="nav-user"><UserRound size={15}/>{user.name}</span><button className="nav-login" onClick={logout}><LogOut size={15}/> Log out</button></> : <Link className="nav-cta" to="/login">Log in <ArrowRight size={16}/></Link>}
    </nav>
  </div></header>;
}
function EventCard({ event }) {
  const remaining = Math.max(0, event.capacity - (event.seatsBooked || 0));
  return <Link className="event-card" to={`/events/${event._id}`}>
    <div className="event-image"><img src={imageFor(event)} alt={event.title} loading="lazy"/><span className="category-pill">{event.category || 'Event'}</span><span className="price-pill">{money(event.price)}</span></div>
    <div className="event-info"><div className="event-date"><CalendarDays size={15}/>{dateLabel(event.date)}</div><h3>{event.title}</h3><p className="event-place"><MapPin size={15}/>{event.city} · {event.venue}</p><div className="event-bottom"><span className="availability">{remaining > 0 ? `${remaining} spots left` : 'Sold out'}</span><span className="arrow-circle"><ArrowRight size={16}/></span></div></div>
  </Link>;
}
function Home() {
  const [events, setEvents] = useState([]); const [search, setSearch] = useState(''); const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { setLoading(true); api(`/events?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`).then(setEvents).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [search, category]);
  const categories = ['All', 'Music', 'Technology', 'Art', 'Food', 'Business', 'Other'];
  return <><section className="hero"><div className="hero-glow glow-one"/><div className="hero-glow glow-two"/><div className="wrap hero-content"><div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT GREAT MEMORY STARTS HERE</div><h1>Make room for<br/><span>something unforgettable.</span></h1><p className="hero-copy">Discover experiences that bring people together. Find your crowd, book your spot, and make it a moment.</p><div className="hero-search"><Search size={20}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, cities, venues..."/><button onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>Find events <ArrowRight size={16}/></button></div><div className="hero-stats"><div><strong>Real moments</strong><span>Made for sharing</span></div><div><strong>Easy booking</strong><span>Your ticket, sorted</span></div><div><strong>Every interest</strong><span>Find your people</span></div></div></div><div className="hero-decoration"><div className="floating-card"><span className="float-icon"><Ticket size={18}/></span><div><strong>Your next story</strong><small>is one ticket away</small></div><span className="float-check">✓</span></div></div></section>
  <main className="wrap events-section" id="events"><div className="section-heading"><div><div className="eyebrow dark-eyebrow">CURATED FOR YOU</div><h2>Find your next <span>experience.</span></h2><p>From live music to bright ideas, there’s a place for you.</p></div><div className="result-count"><strong>{events.length.toString().padStart(2,'0')}</strong><span>events to explore</span></div></div>
  <div className="category-row">{categories.map(c => <button key={c} className={category === c ? 'category-btn active' : 'category-btn'} onClick={() => setCategory(c)}>{c}</button>)}</div>
  {error && <div className="notice error">{error} — make sure the server and MongoDB are running.</div>}
  {loading ? <div className="empty-state">Finding great events…</div> : events.length ? <div className="event-grid">{events.map(event => <EventCard key={event._id} event={event}/>)}</div> : <div className="empty-state"><span className="empty-icon"><CalendarDays size={24}/></span><h3>No events found just yet</h3><p>Try another search or category, or check back soon.</p><button className="outline-btn" onClick={() => {setSearch('');setCategory('All')}}>Clear filters</button></div>}
  </main><section className="bottom-cta"><div className="wrap bottom-cta-inner"><div><div className="eyebrow">HAVE AN IDEA?</div><h2>Bring people together.</h2><p>Great events start with someone who cares enough to create one.</p></div><Link to="/login" className="light-cta">Get started <ArrowRight size={17}/></Link></div></section></>;
}
function Login() {
  const { login } = useAuth(); const nav = useNavigate(); const [mode,setMode] = useState('login'); const [form,setForm] = useState({name:'',email:'',password:''}); const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
  const change = e => setForm({...form,[e.target.name]:e.target.value});
  async function submit(e) { e.preventDefault(); setError(''); setBusy(true); try { await login(mode,form); nav('/'); } catch(err) { setError(err.message); } finally { setBusy(false); } }
  return <main className="auth-wrap"><div className="auth-art"><div className="auth-art-content"><span className="auth-symbol"><Sparkles size={26}/></span><h2>Good things happen<br/>when we <em>get together.</em></h2><p>Find the experiences you’ll talk about long after they’re over.</p><div className="auth-art-tags"><span>Live music</span><span>Fresh ideas</span><span>New friends</span></div></div></div><div className="auth-panel"><div className="auth-box"><Link to="/" className="back-link">← Back to exploring</Link><h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="muted">{mode === 'login' ? 'Your next great experience awaits.' : 'Join the community and find your people.'}</p><div className="auth-switch"><button className={mode==='login'?'selected':''} onClick={()=>{setMode('login');setError('')}}>Log in</button><button className={mode==='register'?'selected':''} onClick={()=>{setMode('register');setError('')}}>Sign up</button></div><form onSubmit={submit} className="auth-form">{mode==='register' && <label>Full name<input name="name" value={form.name} onChange={change} placeholder="Your name" required/></label>}<label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required/></label><label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="At least 8 characters" minLength={8} required/></label>{error && <div className="notice error">{error}</div>}<button className="primary-btn full-btn" disabled={busy}>{busy?'Please wait…':mode==='login'?'Log in to Eventify':'Create account'} <ArrowRight size={17}/></button></form><p className="fine-print">By continuing, you agree to use Eventify responsibly. This demo does not process payments.</p></div></div></main>;
}
function EventDetail() {
  const {id}=useParams(); const {user}=useAuth(); const nav=useNavigate(); const [event,setEvent]=useState(null); const [quantity,setQuantity]=useState(1); const [error,setError]=useState(''); const [success,setSuccess]=useState('');
  useEffect(()=>{api(`/events/${id}`).then(setEvent).catch(e=>setError(e.message))},[id]);
  async function book(){if(!user){nav('/login');return;}setError('');setSuccess('');try{await api('/bookings',{method:'POST',body:JSON.stringify({eventId:id,quantity})});setSuccess('You’re booked! Your tickets are in My tickets.');const updated=await api(`/events/${id}`);setEvent(updated);}catch(e){setError(e.message)}}
  if(!event && !error) return <div className="empty-state">Loading event…</div>;
  if(error && !event) return <div className="wrap page-content"><div className="notice error">{error}</div><Link to="/" className="back-link">← Back to events</Link></div>;
  const remaining=Math.max(0,event.capacity-(event.seatsBooked||0));
  return <main className="wrap detail-page"><Link to="/" className="back-link">← All events</Link><div className="detail-layout"><div><div className="detail-image"><img src={imageFor(event)} alt={event.title}/><span className="category-pill">{event.category}</span></div><div className="detail-copy"><div className="eyebrow dark-eyebrow">THE EXPERIENCE</div><h1>{event.title}</h1><p>{event.description}</p><div className="detail-facts"><div><CalendarDays/><span><small>DATE</small><strong>{dateLabel(event.date)}</strong></span></div><div><MapPin/><span><small>LOCATION</small><strong>{event.venue}, {event.city}</strong></span></div><div><Clock3/><span><small>AVAILABILITY</small><strong>{remaining} spots remaining</strong></span></div></div></div></div><aside className="booking-box"><div className="eyebrow dark-eyebrow">SAVE YOUR SPOT</div><div className="booking-price">{money(event.price)}<small> / ticket</small></div><p className="muted">Your next memory is waiting.</p><div className="quantity-control"><span>Tickets</span><div><button onClick={()=>setQuantity(Math.max(1,quantity-1))} disabled={quantity<=1}>−</button><strong>{quantity}</strong><button onClick={()=>setQuantity(Math.min(10,quantity+1))} disabled={quantity>=10}>+</button></div></div><div className="total-line"><span>Total</span><strong>{money(event.price*quantity)}</strong></div>{error && <div className="notice error">{error}</div>}{success && <div className="notice success">{success}</div>}<button className="primary-btn full-btn" disabled={remaining<1 || quantity>remaining} onClick={book}>{remaining<1?'Sold out':user?'Book tickets':'Log in to book'} <ArrowRight size={17}/></button><p className="booking-note">No payment is collected in this demo.</p></aside></div></main>;
}
function Bookings() {
  const [items,setItems]=useState([]); const [error,setError]=useState('');
  async function load(){try{setItems(await api('/bookings/my'))}catch(e){setError(e.message)}}
  useEffect(()=>{load()},[]);
  async function cancel(id){if(!confirm('Cancel this booking?'))return;try{await api(`/bookings/${id}`,{method:'DELETE'});load()}catch(e){setError(e.message)}}
  return <main className="wrap page-content"><div className="eyebrow dark-eyebrow">YOUR PLANS</div><h1 className="page-title">My tickets<span>.</span></h1><p className="page-subtitle">All your booked experiences, in one place.</p>{error&&<div className="notice error">{error}</div>}{items.length?<div className="booking-list">{items.map(b=><div className="booking-item" key={b._id}><img src={b.event?imageFor(b.event):demoImages.Other} alt=""/><div className="booking-item-main"><span className="event-date"><CalendarDays size={14}/>{b.event?dateLabel(b.event.date):'Event unavailable'}</span><h3>{b.event?.title||'Deleted event'}</h3><p>{b.event?.city} · {b.quantity} ticket(s)</p></div><div className="booking-item-end"><strong>{money(b.totalPrice)}</strong><button className="text-danger" onClick={()=>cancel(b._id)}>Cancel booking</button></div></div>)}</div>:<div className="empty-state"><span className="empty-icon"><Ticket size={24}/></span><h3>Your next adventure is out there</h3><p>You haven’t booked any events yet.</p><Link className="primary-btn" to="/">Explore events <ArrowRight size={16}/></Link></div>}</main>;
}
const blankEvent={title:'',description:'',category:'Music',venue:'',city:'',date:'',price:'0',capacity:'100',imageUrl:''};
function Admin() {
  const [events,setEvents]=useState([]); const [form,setForm]=useState(blankEvent); const [editing,setEditing]=useState(''); const [error,setError]=useState(''); const [message,setMessage]=useState('');
  async function load(){try{setEvents(await api('/events?upcoming=false'))}catch(e){setError(e.message)}}
  useEffect(()=>{load()},[]);
  function edit(e){setEditing(e._id);setForm({...e,date:new Date(e.date).toISOString().slice(0,16) });window.scrollTo({top:0,behavior:'smooth'})}
  async function submit(e){e.preventDefault();setError('');setMessage('');try{await api(editing?`/events/${editing}`:'/events',{method:editing?'PUT':'POST',body:JSON.stringify({...form,price:Number(form.price),capacity:Number(form.capacity),date:new Date(form.date).toISOString()})});setMessage(editing?'Event updated.':'Event created.');setForm(blankEvent);setEditing('');load()}catch(e){setError(e.message)}}
  async function remove(id){if(!confirm('Delete this event and its bookings?'))return;try{await api(`/events/${id}`,{method:'DELETE'});setMessage('Event deleted.');load()}catch(e){setError(e.message)}}
  return <main className="wrap page-content"><div className="eyebrow dark-eyebrow">EVENT ORGANIZER</div><h1 className="page-title">Manage events<span>.</span></h1><p className="page-subtitle">Create experiences and keep your event listings up to date.</p>{error&&<div className="notice error">{error}</div>}{message&&<div className="notice success">{message}</div>}<form className="admin-form" onSubmit={submit}><h2>{editing?'Edit event':'Create an event'}</h2><div className="form-grid"><label>Event title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Music','Technology','Art','Food','Business','Other'].map(c=><option key={c}>{c}</option>)}</select></label><label>Venue<input required value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})}/></label><label>City<input required value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label><label>Date and time<input required type="datetime-local" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Ticket price (USD)<input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Capacity<input required type="number" min="1" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/></label><label>Image URL (optional)<input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/></label><label className="wide-field">Description<textarea required rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label></div><div className="form-actions"><button className="primary-btn">{editing?'Save changes':'Publish event'} <ArrowRight size={16}/></button>{editing&&<button type="button" className="outline-btn" onClick={()=>{setEditing('');setForm(blankEvent)}}>Cancel</button>}</div></form><h2 className="admin-list-title">All events ({events.length})</h2><div className="admin-events">{events.map(e=><div className="admin-event" key={e._id}><div><strong>{e.title}</strong><span>{e.city} · {dateLabel(e.date)} · {money(e.price)}</span></div><div><button className="outline-btn small-btn" onClick={()=>edit(e)}>Edit</button><button className="text-danger" onClick={()=>remove(e._id)}>Delete</button></div></div>)}</div></main>;
}
function Footer(){return <footer className="footer"><div className="wrap footer-inner"><Link className="brand footer-brand" to="/"><span className="brand-icon"><Sparkles size={18}/></span>eventify<span className="brand-dot">.</span></Link><span>Made for moments that matter.</span><span>© {new Date().getFullYear()} Eventify</span></div></footer>}
export default function App(){
  const [user,setUser]=useState(null); const [ready,setReady]=useState(false);
  useEffect(()=>{if(getToken())api('/auth/me').then(d=>setUser(d.user)).catch(()=>localStorage.removeItem('eventify_token')).finally(()=>setReady(true));else setReady(true)},[]);
  async function login(mode,form){const data=await api(`/auth/${mode==='register'?'register':'login'}`,{method:'POST',body:JSON.stringify(form)});localStorage.setItem('eventify_token',data.token);setUser(data.user);}
  function logout(){localStorage.removeItem('eventify_token');setUser(null);}
  const value=useMemo(()=>({user,login,logout}),[user]);
  if(!ready)return <div className="loading-screen"><span className="brand-icon"><Sparkles/></span> Eventify</div>;
  return <AuthContext.Provider value={value}><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/events/:id" element={<EventDetail/>}/><Route path="/bookings" element={user?<Bookings/>:<Login/>}/><Route path="/admin" element={user?.role==='admin'?<Admin/>:<Login/>}/><Route path="*" element={<main className="empty-state"><h3>Page not found</h3><Link to="/">Back home</Link></main>}/></Routes><Footer/></AuthContext.Provider>;
}
