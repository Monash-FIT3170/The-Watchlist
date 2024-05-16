import React from 'react';
import ContentItem from './ContentItem';

const FullContentList = ({ list }) => {
    const contentarr = list.content;

    const content = contentarr.map((item, index) => (
        <ContentItem key={index} id={item.content_id} type={item.type} src={item.image_url} alt={item.title} rating={item.rating} />
    ));


    return (
        <div>
            <h1 className="text-3xl font-bold">{list.title}</h1>
            <div className="flex flex-wrap justify-flex-start items-start mt-4">
              {content}
            </div>
        </div>
    );
};

export default FullContentList;
