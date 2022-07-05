import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
import useSWR from "swr";
import Head from "next/head";

import { getFilteredEvents } from "../../helpers/api-util";


function FilteredEventsPage(props){
    const [loadedEvents, setLoadedEvents] = useState();
    const router = useRouter();

    const filterData = router.query.slug;

    const { data, error } = useSWR(filterData ? `/api/events/${filterData[0]}/${filterData[1]}` : null,  (url) => fetch(url).then(res => res.json()));

    useEffect(() => {
        if(!filterData) {
            return;
        }
        if(data){

            console.log(data);
            setLoadedEvents(data.events)
        }
    }, [filterData, data]);

    let pageHeadData = (
        <Head>
            <title>Filtered Events</title>
            <meta 
                name="description" 
                content="A list of filtered events."
            />
        </Head>
    );    
    
    if (!loadedEvents) {
        return (
            <Fragment>
                {pageHeadData}
                <p className="center">Loading...</p>
            </Fragment>
        );
    }

    const filteredYear = filterData[0];
    const filteredMonth = filterData[1];    
    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    pageHeadData = (
        <Head>
            <title>Filtered Events</title>
            <meta 
                name="description" 
                content={`All Events for ${numMonth}/${numYear}.`}
            />
        </Head>
    ); 

    if (
        isNaN(numYear) || 
        isNaN(numMonth) || 
        numYear > 2030 || 
        numYear < 2021 || 
        numMonth < 1 || 
        numMonth > 12 ||
        error
    ) {
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert>
                    <p>Invalid filter, please adjust your values!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        );
    }

    if (!loadedEvents || loadedEvents.length === 0){
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert>
                    <p>No events found for the chosen filter!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        );
    }

    const date = new Date(numYear, numMonth -1);

    return (
        <Fragment>
            <Head>
                <title>Filtered Events</title>
                <meta name="description" content={`All Events for ${numMonth}/${numYear}.`}/>
            </Head>
            <ResultsTitle date={date}/>
            <EventList items={loadedEvents}/>
        </Fragment>
    );

}

// export async function getServerSideProps( context) {
//     const { params } = context;

//     const filterData = params.slug;

//     const filteredYear = filterData[0];
//     const filteredMonth = filterData[1];

//     const numYear = +filteredYear;
//     const numMonth = +filteredMonth;

//     if (
//         isNaN(numYear) || 
//         isNaN(numMonth) || 
//         numYear > 2030 || 
//         numYear < 2021 || 
//         numMonth < 1 || 
//         numMonth > 12
//     ) {
//         return {
//             props: { hasError: true },
//             // notFount: true,
//             // redirect: {
//             //     destination: "/error"
//             // }
//         }
//     }

//     const filteredEvents = await getFilteredEvents({
//         year: numYear, 
//         month: numMonth
//     });

//     return {
//         props: {
//             events: filteredEvents,
//             date: {
//                 year: numYear,
//                 month: numMonth,
//             }
//         }
//     };

// }

export default FilteredEventsPage;