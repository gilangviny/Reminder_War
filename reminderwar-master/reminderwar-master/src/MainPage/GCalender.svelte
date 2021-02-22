<script>
  import { afterUpdate } from "svelte";
  afterUpdate(() => {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {});
    calendar.render();
  });
</script>

<style>
  .card {
    border-radius: 15px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
</style>

<div class="card">
  <div class="card-body">
    <div id="calendar" />
  </div>
</div>
