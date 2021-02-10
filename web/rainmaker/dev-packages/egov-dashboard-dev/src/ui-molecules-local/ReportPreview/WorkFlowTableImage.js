import React, { Component }  from "react";
// import ImageViewer from "react-simple-image-viewer";
import './index.css';


class WorkFlowTableImage extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            currentImage: 0,
            isViewerOpen: false,
            images: props.images
        }
      }
    
      componentDidMount(){
    
        //debugger;
        const data = this.state.images
      }
    
      closeImageViewer=()=>{
          //debugger;
        this.setState({
            currentImage: 0,
            isViewerOpen: false
        })
      }
    
      openImageViewer=(index)=>{
        this.setState({
            currentImage: index,
            isViewerOpen: true
        })
      }

      render() {
           
        return (
          <div>
            {/* <center> */}
            <div> <h2> Workflow Pictorial Preview </h2> </div>

            {this.state.images.map((src, index) => (
            <img
            src={ src }
            onClick={ () => this.openImageViewer(index) }
            width="50%"
            key={ index }
            style={{ margin: '2px' }}
            alt=""/>
            ))}

            {this.state.isViewerOpen && (
                <ImageViewer
                src={ this.state.images }
                currentIndex={ this.state.currentImage }
                onClose={ this.closeImageViewer }
                />
            )}
            {/* </center> */}
          </div>
        );
      }
}

export default WorkFlowTableImage;