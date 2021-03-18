<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import Button from "./UI/Button.svelte";
  import meetups from "./Meetups/meetup-store.js";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";
  import LoadingSpinner from './UI/LoadingSnipper.svelte';

  let editMode = false;
  let editedId;
  let page = "overview";
  let pageData = {};
  let isLoading = true;

  fetch(
    "https://svelte-meetups-302c3-default-rtdb.europe-west1.firebasedatabase.app/meetups.json"
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed fetching! try again laterz.");
      }
      return res.json();
    })
    .then((data) => {
      const loadedMeetups = [];
      for (const key in data) {
        loadedMeetups.push({
          ...data[key],
          id: key,
        });
      }
      setTimeout(() => {
        isLoading = false;
        meetups.setMeetups(loadedMeetups);
      }, 1000);
    })
    .catch((err) => console.log(err));

  function savedMeetup() {
    editMode = !editMode;
    editedId = null;
  }
  function cancelEdit() {
    editMode = false;
    editedId = null;
  }
  function showDetails(event) {
    page = "details";
    pageData.id = event.detail;
  }
  function closeDetails() {
    page = "overview";
    let pageData = {};
  }
  function startEdit(e) {
    editMode = true;
    editedId = e.detail;
  }
</script>

<Header />
<main>
  {#if page === "overview"}
    {#if editMode}
      <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
    {:else if isLoading}
      <LoadingSpinner />
    {:else}
      <MeetupGrid
        meetups={$meetups}
        on:showdetails={showDetails}
        on:edit={startEdit}
        on:add-meetup={() => (editMode = "edit")}
      />
    {/if}
  {:else}
    <MeetupDetail id={pageData.id} on:close={closeDetails} />
  {/if}
</main>

<style>
  main {
    margin-top: 10rem;
  }

  * {
    margin: auto;
  }
</style>
