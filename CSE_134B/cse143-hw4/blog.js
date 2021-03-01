
var postArr = [
  {
    id: '1',
    title: "Why the Clippers don't need a point guard",
    date: "Feb 10 2021",
    summary: "It's well known that the Clippers' biggest hole in their roster is their lack of a solid point guard. However, I think as long as we continue to move the ball and utilize Kawhi and PG as knock down scorers LIKE THEIR SUPPOSED TO BE, then we'll be fine."
  },
  {
    id: '2',
    title: "Please trade Serge Ibaka",
    date: "Feb 11 2021",
    summary: "Dude Ibaka is so soft, like it's nice to have a big that can shoot the 3, but he is a pole on defense and cannot finish under the rim. We already have so many guys who can space the floor, we need someone inside that can get boards and body people in the paint."
  },
  {
    id: '3',
    title: "Injuries are the story of this team",
    date: "Feb 13 2021",
    summary: "I swear that we don't have enough playmakers to just get away with all of our players not playing in the regular season because their injured. Feels bad man..."
  },
  {
    id: '4',
    title: "I love cats man",
    date: "Feb 15 2021",
    summary: "I love cats man. I love them so much",
  }
];



var currentPostCount = postArr.length;
var updatingVar; // i dont wanna have to do this but i cant think of a different way around it :(

let postList = document.getElementById('post-list');
let postTemplate = document.getElementById('post-template');
let postDialog = document.getElementById('post-dialog');
let updateDialog = document.getElementById('update-dialog');



// dompurify 
function cleanHTML(arr, dirtyHTML) {
  let clean = DOMPurify.sanitize(dirtyHTML);
  return clean;
} 

function getPosts() {
  return postArr;
}

// remove post from list
function removePost(id) {
  postArr = postArr.filter(post => post.id !== id);
  writePostsToHTML();
}

// update post inplace in list
function updatePost(id) {

  removePost(id);
  let updatedPost = {
    title: '',
    date: '',
    summary: '',
    id: '',
  };

  // get and parse dialog fields
  let dialogTitle = document.getElementById('update-dialog-title');
  let dialogSummary = document.getElementById('update-dialog-summary');
  updatedPost.title = cleanHTML`${dialogTitle.value}`;
  updatedPost.date = (new Date()).toString().substr(0, 10);
  updatedPost.summary = cleanHTML`${dialogSummary.value}`;
  updatedPost.id = id;
  console.log(id);

  // add new post object to post array
  let arr = getPosts();
  arr.push(updatedPost);

  writePostsToHTML();

  // clear values in dialog
  dialogTitle.value = '';
  dialogSummary.value = '';
  updateDialog.close();
}

// create new post and add to list
function createPost() {
  // intialize post object
  let newPost = { 
    title: '',
    date: '',
    summary: '',
    id: '',
  };

  // get and parse dialog fields
  let dialogTitle = document.getElementById('post-dialog-title');
  let dialogSummary = document.getElementById('post-dialog-summary');
  newPost.title = cleanHTML`${dialogTitle.value}`;
  newPost.date = (new Date()).toString().substr(0, 10);
  newPost.summary = cleanHTML`${dialogSummary.value}`;
  newPost.id = currentPostCount++;

  // add new post object to post array
  let arr = getPosts();
  arr.push(newPost);

  // add post array to document
  writePostsToHTML();
  
  // clear values in dialog
  dialogTitle.value = '';
  dialogSummary.value = '';
  postDialog.close();
}

// convert all post objects in the array into html elements and append to document
function writePostsToHTML() {
 
  if ('content' in document.createElement('template')) {
    postList.innerHTML = '';
    let arr = getPosts();
    arr = arr.sort((p1, p2) => {
      return p1.id - p2.id
    });
    arr.forEach(post => {
      postToHTML(post, postTemplate);
    });
  } else {
    alert('browser does not support templates so this website is broken for u so sad');
  }
}

// converts post object into html element and appends
function postToHTML(post, postTemplate) {
  // get elements from template document fragment
  let postClone = postTemplate.content.cloneNode(true);
  let title = postClone.getElementById('title');
  let date = postClone.getElementById('date');
  let body = postClone.getElementById('body');

  // set the text content of our template
  title.textContent = cleanHTML`${post.title}`;
  date.textContent = post.date;
  body.textContent = cleanHTML`${post.summary}`;

  // add remove and update event listeners 
  postClone.getElementById('edit-btn').addEventListener('click', () => {
    let postToEdit = postArr.filter(item => item.id === post.id)[0];
    let dialogTitle = document.getElementById('update-dialog-title');
    dialogTitle.value = postToEdit.title;
    let dialogSummary = document.getElementById('update-dialog-summary');
    dialogSummary.value = postToEdit.summary;
    updatingVar = post.id;
    updateDialog.showModal();
  });

  postClone.getElementById('delete-btn').addEventListener('click', () => {
    removePost(post.id)
  });

  // add fragment to document
  postList.prepend(postClone);
}


document.addEventListener('DOMContentLoaded', () => {
 
  // write current posts to HTML
  writePostsToHTML(getPosts());

  // create post btn event listener
  document.getElementById('create-post').addEventListener('click', () => {
    if (typeof postDialog.showModal === "function") {
      postDialog.showModal();
    } else {
      alert("The <dialog> API is not supported by this browser");
    }
  });

  postDialog.addEventListener('close', () => {
    if (postDialog.returnValue === 'default') {
      createPost();
    }
  });

  updateDialog.addEventListener('close', () => {
    if (updateDialog.returnValue === 'default') {
      updatePost(updatingVar);
    }
  });
});