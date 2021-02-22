<script>
  let j;
  var date = new Date();
  function get_month() {
    let get_month = Number(date.getMonth()) + 1;
    if (get_month < 10) {
      return "0" + get_month;
    } else {
      return get_month;
    }
  }

  function get_date() {
    let get_date = date.getDate();
    if (get_date < 10) {
      return "0" + get_date;
    } else {
      return get_date;
    }
  }
  let today_date = date.getFullYear() + "-" + get_month() + "-" + get_date();

  import { db_user } from "../config.js";
  import { onMount, afterUpdate } from "svelte";
  import firebase from "firebase/app";

  let dataSchedule = [];
  let length = 0;
  let wr = false;
  let aula = false;
  let sekar = false;
  let fivec = false;
  let other = false;
  onMount(async () => {
    dataSchedule = [];
    db_user
      .collection("schedule")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          dataSchedule[dataSchedule.length] = doc.data();
        });
        for (j = 0; j < dataSchedule.length; j++) {
          if (dataSchedule[j].date == today_date) {
            if (dataSchedule[j].location == "AULA") {
              aula = true;
            }
            if (dataSchedule[j].location == "SEKAR") {
              sekar = true;
            }
            if (dataSchedule[j].location == "WAR_ROOM") {
              wr = true;
            }
            if (dataSchedule[j].location == "5C") {
              fivec = true;
            }
            if (dataSchedule[j].location == "OTHER") {
              other = true;
            }
          }
        }
      });
  });
</script>

<style>
  .scroll-today-event {
    max-height: 125px !important;
    overflow-y: auto;
  }

  .scroll-today-event::-webkit-scrollbar {
    display: none;
  }

  .card-header {
    background-color: #9c5518 !important;
    color: aliceblue;
  }
  .card {
    border-radius: 8px !important;
  }
</style>

{#if aula}
  <div class="card scroll-today-event mb-4">
    <div class="card-header">
      <h6 style="font-family: 'Varela Round', sans-serif; font-weight:bold;">
        AULA
      </h6>
    </div>
    <div class="card-body">
      {#each dataSchedule as props}
        {#if props.date == today_date}
          {#if props.location == 'AULA'}
            <p>
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.start} -
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.end},
              <i class="fa fa-user" aria-hidden="true" />
              {props.created}
            </p>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if sekar}
  <div class="card scroll-today-event mb-4">
    <div class="card-header">
      <h6 style="font-family: 'Varela Round', sans-serif; font-weight:bold;">
        SEKAR
      </h6>
    </div>
    <div class="card-body">
      {#each dataSchedule as props}
        {#if props.date == today_date}
          {#if props.location == 'SEKAR'}
            <p>
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.start} -
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.end},
              <i class="fa fa-user" aria-hidden="true" />
              {props.created}
            </p>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if wr}
  <div class="card scroll-today-event mb-4">
    <div class="card-header">
      <h6 style="font-family: 'Varela Round', sans-serif; font-weight:bold;">
        WAR ROOM
      </h6>
    </div>
    <div class="card-body">
      {#each dataSchedule as props}
        {#if props.date == today_date}
          {#if props.location == 'WAR_ROOM'}
            <p>
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.start} -
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.end},
              <i class="fa fa-user" aria-hidden="true" />
              {props.created}
            </p>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if fivec}
  <div class="card scroll-today-event mb-2">
    <div class="card-header">
      <h6 style="font-family: 'Varela Round', sans-serif; font-weight:bold;">
        5C
      </h6>
    </div>
    <div class="card-body">
      {#each dataSchedule as props}
        {#if props.date == today_date}
          {#if props.location == '5C'}
            <p>
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.start} -
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.end},
              <i class="fa fa-user" aria-hidden="true" />
              {props.created}
            </p>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if other}
  <div class="card scroll-today-event mb-4">
    <div class="card-header">
      <h6 style="font-family: 'Varela Round', sans-serif; font-weight:bold;">
        OTHER
      </h6>
    </div>
    <div class="card-body">
      {#each dataSchedule as props}
        {#if props.date == today_date}
          {#if props.location == 'OTHER'}
            <p>
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.start} -
              <i class="fa fa-clock-o" aria-hidden="true" />
              {props.end},
              <i class="fa fa-user" aria-hidden="true" />
              {props.created}
            </p>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}
