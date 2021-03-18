<script>
  import {createEventDispatcher} from 'svelte'
  import MeetupItem from "./MeetupItem.svelte";
  import MeetupFilter from './MeetupFilter.svelte'
  import Button from '../UI/Button.svelte'
  import {flip} from 'svelte/animate';
  import {scale} from 'svelte/transition';

  
  const dispatch = createEventDispatcher()

  export let meetups;

  let favsOnly = false;

  $: filteredMeetups = favsOnly ? meetups.filter(m => m.isFavorite) : meetups;

  function setFilter(event){
    favsOnly = event.detail === 1;


  }
</script>


<section id="meetup-controls">
  <MeetupFilter on:select={setFilter}  />

  <Button on:click={() => dispatch('add-meetup') }>Add Meetup</Button>
</section>
<section id="meetups">

  {#each filteredMeetups as meetup (meetup.id)}
  <div transition:scale animate:flip={{duration:200}} >
    <MeetupItem
      id={meetup.id}
      title={meetup.title}
      subtitle={meetup.subtitle}
      description={meetup.description}
      image={meetup.image}
      email={meetup.contactEmail}
      address={meetup.address}
      isFav={meetup.isFavorite}
      on:showdetails 
      on:edit 
    />
  </div>
  {/each}
</section>

<style>
  #meetups {
    margin-top: 5rem;
  }

  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
