import TraceThePromise from './TraceThePromise.jsx';
import SeashellHunt from './SeashellHunt.jsx';
import PopcornCatch from './PopcornCatch.jsx';
import FeedEachOther from './FeedEachOther.jsx';
import WindowSeat from './WindowSeat.jsx';
import SkyDream from './SkyDream.jsx';
import BirthdayCake from './BirthdayCake.jsx';
import StopTheWheel from './StopTheWheel.jsx';
import PerfectPour from './PerfectPour.jsx';
import MakeAWish from './MakeAWish.jsx';
import CheerMeter from './CheerMeter.jsx';
import LightTheSky from './LightTheSky.jsx';

// One game per island (matches chapter ids in data/story.js).
export const games = {
  proposal: {
    title: 'Trace the Promise',
    Component: TraceThePromise,
    reward: 'You traced the shape of my heart — it has only ever pointed to you. 💍',
  },
  goa: {
    title: 'Seashell Hunt',
    Component: SeashellHunt,
    reward: 'Sun, sand, waves, you and me — my favourite kind of getaway. 🐚',
  },
  movie: {
    title: 'Catch the Popcorn',
    Component: PopcornCatch,
    reward: 'Closer than the story on screen — every movie night with you. 🍿',
  },
  food: {
    title: 'Feed Each Other',
    Component: FeedEachOther,
    reward: 'Every flavour tastes better because I get to share it with you. 🍴',
  },
  flight: {
    title: 'Window Seat',
    Component: WindowSeat,
    reward: 'Our first time above the clouds — a little scared, mostly in love. ✈️',
  },
  dream: {
    title: 'Reach the Sky',
    Component: SkyDream,
    reward: 'Destination: your dreams. I will always be your biggest fan. ⭐',
  },
  birthdays: {
    title: 'Blow Out the Candles',
    Component: BirthdayCake,
    reward: 'Make a wish, my love — every birthday with you is the best gift. 🎂',
  },
  themepark: {
    title: 'Stop the Wheel',
    Component: StopTheWheel,
    reward: 'Top of the world, side by side — my favourite view is always you. 🎡',
  },
  hoteldate: {
    title: 'The Perfect Pour',
    Component: PerfectPour,
    reward: 'Candlelight, a rose, and you — the most elegant evening of my life. 🥂',
  },
  manifestation: {
    title: 'Make a Wish',
    Component: MakeAWish,
    reward: 'Every wish we send to the sky, we make real together. 🏮',
  },
  achievements: {
    title: 'Cheer Meter',
    Component: CheerMeter,
    reward: 'Big wins, tiny wins — I celebrate every single one with you. 🏆',
  },
  everything: {
    title: 'Light the Sky',
    Component: LightTheSky,
    reward: 'My world, my love, my everything. Happy one year. 💗',
  },
};
