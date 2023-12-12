import { useState } from 'react';
import './App.css'


const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button({children,onClick}){
  return <button className='button' onClick={onClick}>{children}</button>
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddedFriend,setShowAddedFriend]=useState(false)
  const [selectionFriend, setSelectionFriend] = useState(false)

  function handleShowFriendButton(){
    setShowAddedFriend((show) => !show)
  }
  
  function handleAddFriend(friend){
    setFriends(friends =>[...friends, friend])
    setShowAddedFriend((show) => !show)
  }

  function handleSelectFriend(friend){
    // setSelectionFriend(friend)

    setSelectionFriend((cur) => cur?.id === friend.id ? null : friend)
    setShowAddedFriend(false)
  }

  function handleSubmitBill(value){
    setFriends(friends => friends.map(friend => friend.id === selectionFriend.id 
      ? {...friend, balance : friend.balance + value}
      : friend
      ))

    setSelectionFriend(null)
  }

  return (
    <div className='app'>
      <div className="sidebar">
        <FriendList friends={friends} onSelectFriends={handleSelectFriend} selectionFriend={selectionFriend}/>
        {showAddedFriend && <FormAddFriend onAddFriends={handleAddFriend}/>}
        <Button onClick={handleShowFriendButton}>{showAddedFriend ? 'Close' : 'Add Friend'}</Button>
      </div>
      {selectionFriend && <FormSplitBill selectionFriend={selectionFriend} onSubmitBill={handleSubmitBill}/>}
    </div>
  )
}


function FriendList({friends,onSelectFriends,selectionFriend}){
  return (
    <div>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onSelectFriends={onSelectFriends} selectionFriend={selectionFriend}/>
      ))}
    </div>
  )
}

function Friend({friend,onSelectFriends,selectionFriend}){
  const isSelected = selectionFriend?.id === friend.id
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name}/>
      <h3>{friend.name}</h3>
      {friend.balance < 0 &&
        <p className='red'>
          You owe {friend.name} {Math.abs(friend.balance)}E
        </p>
      }
      {friend.balance > 0 &&
        <p className='green'>
          {friend.name} owes you {Math.abs(friend.balance)}E
        </p>
      }
      {friend.balance === 0 &&
        <p>
          You and {friend.name} are even
        </p>
      }

      <Button onClick={()=>onSelectFriends(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )
}


function FormAddFriend({onAddFriends}){

  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function handleSubmit(e){
    e.preventDefault()
    
    if(!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id:id,
      name,
      image:`${image}?=${id}`,
      balance:0
    }
    onAddFriends(newFriend)

    setName('');
    setImage('https://i.pravatar.cc/48');
  }


  return (
    <form action="" className='form-add-friend' onSubmit={handleSubmit}>
      <label>👬 Friend Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      <label>🌄 Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/>
      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({selectionFriend,onSubmitBill}){

  function handleSubmit(e){
    e.preventDefault();
    if(!bill || !paidByUser) return;

    onSubmitBill(
      whoIsPaying === 'user' ? paidByFriend : -paidByUser
    )
  }

  const [bill, setBill] = useState("")
  const [paidByUser, setPaidByUser] = useState("")
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectionFriend.name}</h2>
      <label>💰 Bill value</label>
      <input 
      type="text"
      value={bill}
      onChange={(e)=>setBill(Number(e.target.value))}
      />
      <label>🧍‍♂️ Your expense</label>
      <input 
      type="text"
      value={paidByUser}
      onChange={(e)=>setPaidByUser(
        Number(e.target.value) > bill
        ?paidByUser
        :Number(e.target.value)
        )}
      />
      <label>👭 {selectionFriend.name}'s expense</label>
      <input 
      type="text" disabled
      value={paidByFriend}
      />
      <label>🤑 Who is paying the bill</label>
      <select
            value={whoIsPaying}
            onChange={(e)=>setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectionFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  )
}