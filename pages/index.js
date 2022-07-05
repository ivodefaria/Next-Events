import Head from "next/head";

import EventList from "../components/events/event-list";
import NewsletterRegistration from "../components/input/newsletter-registration";
import { getFeaturedEvents } from "../helpers/api-util";

function HomePage(props){
    return (
        <div>
            <Head>
                <title>NextJS Events</title>
                <meta name="description" content="Find a lot of great events that allow you to evolve..."/>
            </Head>
            <NewsletterRegistration />
            <EventList items={props.events} />
        </div>
    );
}

export async function getStaticProps() {
    const res = await fetch(`${process.env.HOST}/api/events/featured`)
    const data = await res.json()

    return {
        props: {
            events: data.events,
        },
        revalidate: 1800
    }
}


export default HomePage;