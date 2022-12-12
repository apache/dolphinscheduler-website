import { useState, useRef } from "react";
import { isAfter } from "../utils/formatDate";
import getEvents from "../api/getEvents";

export const useEvents = (locale) => {
  const [events, setEvents] = useState([]);
  const [homeEvents, setHomeEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const cachedEvents = useRef([]);

  const handleEvents = async () => {
    if (loading) return;
    setLoading(true);
    const event = await getEvents(locale);
    let coming = null;
    let post = null;
    event.forEach((item) => {
      const time = new Date(item.startTime).getTime();
      if (
        item.more &&
        (!coming ||
          (coming &&
            time > Date.now() &&
            time < new Date(coming.startTime).getTime()))
      ) {
        coming = item;
        return;
      }
      if (
        item.post &&
        (!post || (post && time > new Date(post.startTime).getTime()))
      ) {
        post = item;
      }
    });
    setHomeEvents([coming, post]);
    setEvents(event);
    cachedEvents.current = event;
    setLoading(false);
  };

  const filterEvents = (type) => {
    if (type === "all") {
      setEvents(cachedEvents.current);
      return;
    }
    if (type === "coming") {
      setEvents(
        cachedEvents.current.filter(
          (event) => event.startTime && isAfter(event.startTime)
        )
      );
      return;
    }
    if (type === "previous") {
      setEvents(
        cachedEvents.current.filter(
          (event) => event.startTime && !isAfter(event.startTime)
        )
      );
      return;
    }
  };

  return {
    events,
    loading,
    getEvents: handleEvents,
    filterEvents,
    homeEvents,
  };
};
