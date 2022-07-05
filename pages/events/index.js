import Head from "next/head";
import { useRouter } from "next/router";
import EventList from "../../components/events/event-list";
import EventsSearch from "../../components/events/events-search";

import { getAllEvents } from "../../helpers/api-util";


function EventsPage(props){
    const router = useRouter();
    const { events } = props;

    function findEventsHandler(year, month){
        const fullPath = `/events/${year}/${month}`;

        router.push(fullPath);
    }

    return (
        <div>
            <Head>
                <title>All Events</title>
                <meta name="description" content="Find a lot of great events that allow you to evolve..."/>
            </Head>
            <EventsSearch onSearch={findEventsHandler} />
            <EventList items={events} />
        </div>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${process.env.HOST}/api/events/`)
    const data = await res.json()
    
    return {
        props: {
            events: data.events,
        },
        revalidate: 60
    }
}


export default EventsPage;