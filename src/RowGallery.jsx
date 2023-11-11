import "./RowGallery.scss";
import useResizeObserver from "./useResizeObserver";
import { useRef, useState, useEffect } from "react";
import GalleryTile from "./GalleryTile";

const RowGallery = ({tiles, layout, wildUpdate}) => {
    const [rows, setRows]= useState([]);
    const rowsRef = useRef({rows: [], width: null});
	const containerRef = useResizeObserver(adjustRows, 1);

    useEffect(()=>{
        if(rowsRef.current.width)
            updateRows(rowsRef.current.width)
    }, [tiles]);

    function updateRows(width) {
        const new_rows = distributeTilesInRows(tiles, layout, width);
        rowsRef.current.rows = new_rows;
        setRows(new_rows);
    }

    function adjustRows(row_rect) {
        rowsRef.current.width = row_rect.width;
        const new_rows = distributeTilesInRows(tiles, layout, row_rect.width);
        const diff_count = () => (new_rows.length != rowsRef.current.rows.length)
        const diff_content = () => new_rows.findLast((row, index) => 
                typeof(rowsRef.current.rows[index]) === undefined
                || row.length !== rowsRef.current.rows[index].length)

        const redraw = diff_count() || diff_content();

        if(redraw){
            rowsRef.current.rows = new_rows;
            setRows(new_rows);
        }
    }

    return (
        <div ref={containerRef} className="bGallery-rows" style={containerStyle(layout)}>
            {rows.map((row, index) => 
                <GalleryRow key={index} row={row} gapY={layout.gap.y} wildUpdate={wildUpdate} /> 
            )}
        </div>
    )
}


export default RowGallery;


const containerStyle = (layout) => ({
        gridRowGap: layout.gap.y,
        padding: (layout.margin.y + "px ") + (layout.margin.x + "px ")
    })


const rowStyle = (gapY, row) => ({
    gridColumnGap: gapY,
    gridTemplateColumns: row.tiles.reduce((text, tile) =>
            text += tile.aspect.w / tile.aspect.h + "fr ", ""),
    height: row.height + "px"
})




const GalleryRow = ({row, gapY, wildUpdate}) => 
        <div className="bGallery-row" style={rowStyle(gapY, row)} >
            {row.tiles.map( (tile, index) => 
                <GalleryTile key={index} content={tile} wildUpdate={wildUpdate}/>
            )}
        </div>


const tilePhantom = (ratio) => ({html: null, aspect: {w: ratio ,h: 1}});


const distributeTilesInRows = (images, layout, row_width) => {
    console.log("heavy calc...");
    //memoize in array?
    const takenRatioInRow = (row) =>{ 
        const images_ratio = row.reduce((taken, image) => taken + imageRatio(image), 0);
        const gapX = layout.gap ? layout.gap.x ? layout.gap.x : layout.gap : 0; 
        const gaps_ratio =   gapX * (row.length - 1) / layout.rows;
        return images_ratio + gaps_ratio;
    }

	const freeRatioInRow = (row) => row_width / layout.rows - takenRatioInRow(row);
    const imageRatio = (image) =>  image.aspect.w/image.aspect.h;

	const rows_tmp = images.reduce((rows, image) => {
        const rowsCP = rows;
        if(rowsCP.length  && freeRatioInRow(rowsCP[rowsCP.length - 1]) >= imageRatio(image)/2)
            rowsCP[rowsCP.length - 1].push(image);
        else rowsCP.push(Array(image))
        return rowsCP;
    }, []);
    
    const last_row_space = freeRatioInRow(rows_tmp[rows_tmp.length-1]);
    if(last_row_space > 0.7)
           rows_tmp[rows_tmp.length-1].push(tilePhantom(last_row_space))

    const rows_with_heights = rows_tmp.map(row_tiles => ({
        tiles: row_tiles, 
        height: row_width / takenRatioInRow(row_tiles)
    }));
	return rows_with_heights;
}
