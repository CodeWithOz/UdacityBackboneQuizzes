// Create your own Event Tracker system:
//
// 1. create an `EventTracker` object
//    • it should accept a name when constructed
// 2. extend the `EventTracker` prototype with:
//    • an `on` method
//    • a `notify` method
//    • a `trigger` method
//
// EXAMPLE:
// function purchase(item) { console.log( 'purchasing ' + item); }
// function celebrate() { console.log( this.name + ' says birthday parties are awesome!' ); }
//
// var nephewParties = new EventTracker( 'nephews ');
// var richard = new EventTracker( 'Richard' );
//
// nephewParties.on( 'mainEvent', purchase );
// richard.on( 'mainEvent', celebrate );
// nephewParties.notify( richard, 'mainEvent' );
//
// nephewParties.trigger( 'mainEvent', 'ice cream' );
//

class EventTracker {
  constructor(name) {
    this.name = name;

    // listeners Map is for the direct event listeners
    this.listeners = new Map();

    // notifications Map is for the indirect event listeners
    this.notifications = new Map();
  }

  on(event, callback) {
    if (this.listeners.has(event)) {
      // add this callback to the Set of callbacks
      this.listeners.get(event).add(callback);
    } else {
      // create a key for this event containing a Set of callbacks
      this.listeners.set(event, new Set([callback]));
    }
  }

  notify(evTracker, event) {
    if (this.notifications.has(event)) {
      // map the supplied event tracker to this event
      this.notifications.get(event).add(evTracker);
    } else {
      // create a key to map event trackers to this event
      this.notifications.set(event, new Set([evTracker]));
    }
  }
}
