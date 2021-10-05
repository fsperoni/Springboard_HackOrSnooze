"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showTrash=false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName()
  const isLoggedIn = Boolean(currentUser)

  return $(`
      <li id="${story.storyId}">
        ${showTrash ? getTrash() : ""}
        ${isLoggedIn ? getStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Collects data from submit form, saves data to API, appends story to DOM. */

async function createStory(evt) {
  console.debug("createStory")
  evt.preventDefault()
  
  // grab data from the form
  const title = $("#story-title").val()
  const author = $("#story-author").val()
  const url = $("#story-url").val()
  
  // After successfully POSTing to the API, the return value is a Story, that
  // we can use to generate a markup and append to the DOM (stories list). 
  const username = currentUser.username
  const result = await storyList.addStory(
    currentUser,
    {
      title,
      author,
      url,
      username
    }
  )

  $newStoryForm.trigger("reset");
  const $newStory = generateStoryMarkup(result)
  $allStoriesList.prepend($newStory)
  $newStoryForm.hide()
}

$newStoryForm.on("submit", createStory)

/** Generates markup for user favorites and appends it to the DOM */
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>You don't have any favorite stories</h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

/** Generate star icon for favorite story feature */
function getStar(story, user) {
  const isFavorite = user.isFavorite(story)
  const starType = isFavorite ? "fas" : "far"
  return `
  <span class="star">
    <i class="${starType} fa-star"></i>
  </span>`
}

/** Generate delete (trash) icon to delete a story */
function getTrash() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`
}

/** Toggle stars for favorite story */
async function toggleFavorite(evt) {
  console.debug("toggleFavorite")

  const $target = $(evt.target)
  const storyId = $target.closest("li").attr("id")
  const story = storyList.stories.find(s => s.storyId === storyId)

  if ($target.hasClass("fas")) { //already favorite -> unfavorite it
    await currentUser.removeFavorite(story);
  } else { //not a favorite -> favorite it
    await currentUser.addFavorite(story);
  }
  $target.closest("i").toggleClass("fas far");
}

$storiesLists.on("click", ".star", toggleFavorite);

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage")

  $myStories.empty()

  if (currentUser.ownStories.length === 0) {
    $myStories.append("<h5>You haven't added any stories.</h5>")
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true)
      $myStories.append($story)
    }
  }

  $myStories.show()
}

/** Deletes a story from API and refreshes DOM with user stories list. */
async function deleteStory(evt) {
  console.debug("deleteStory")

  const storyId = $(evt.target).closest("li").attr("id")

  await storyList.removeStory(currentUser, storyId)
  await putUserStoriesOnPage()
}

$myStories.on("click", ".trash-can", deleteStory)
