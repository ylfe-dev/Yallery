import "./ColumnGallery.scss";
import { useState, useEffect } from "react";
import GalleryTile from "./GalleryTile";

const ColumnGallery = ({tiles, layout, wildUpdate}) => {
    const [columns, setColumns] = useState(distributeTilesInColumns(tiles, layout)); 
    console.log("Render "+columns.length+" columns")

    useEffect(()=>{
       setColumns(distributeTilesInColumns(tiles, layout))
    },[tiles, layout])

    return (
        <div className="bGallery-columns" style={containerStyle(layout)}>
            {columns.map((column, index) => 
                <div  key={index} className="bGallery-column" style={{gridRowGap: layout.gap.y}}>
                    { column.map( (tile, id) => 
                        <GalleryTile key={id}  content={tile} aspect wildUpdate={wildUpdate}/>
                    )}
                </div>
            )}
        </div>
    )
}

export default ColumnGallery;


const containerStyle = (layout) => ({ 
    gridTemplateColumns:  layout.columns.reduce((text, value) => text + (value + "fr "), ""),
    gridColumnGap: layout.gap.x,
    padding: (layout.margin.y + "px ") + (layout.margin.x + "px ")
 })

const distributeTilesInColumns = (tiles, layout) => { 
    
    console.log(layout)
	const findLowestColumn = (columns) => 
		columns.reduce((lowest, col, index) => (col < columns[lowest]) ? index : lowest, 0)

	const columns = [...new Array(layout.columns.length)].map(() => new Array());

	if(layout.columns.length==1)
		columns[0]=tiles.map((img, id)=>({...img, id:id}));
	else {
		const columns_height = new Array(layout.columns.length).fill(0);
		tiles.forEach((tile,id) => { 
			const lowest_column = findLowestColumn(columns_height);
			const columns_width_sum = layout.columns.reduce((acc, col) => acc+=col, 0)
			const lowest_column_width = layout.columns[lowest_column] / columns_width_sum;
			const tile_height = (tile.aspect.h/tile.aspect.w) * lowest_column_width;
			columns_height[lowest_column] +=tile_height;
			columns[lowest_column].push({...tile, id:id});
		})
	}
	return columns
}


