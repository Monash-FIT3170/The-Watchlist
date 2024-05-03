import React from 'react';
import ContentItem from './ContentItem';

const FullContentList = ({ list }) => {
    const repeatedContent = Array.from({ length: 20 }, () => list.content).flat();

    const content = repeatedContent.map((item, index) => (
        <ContentItem key={index} src={item.image_url} alt={item.title} rating={item.rating} />
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
