import React from 'react';
import { ScrollView } from 'react-native-web';
import {
    Link,
    Redirect,
  } from "react-router-dom";
import Header from '../Header/Header';
import './Dashboard.css'
import {TokenContext} from '../account-management/TokenContext'
import handleFetchHttpErrors from '../../helpers/handleFetchHttpErrors'
import { GoSearch  } from 'react-icons/go'
import { TextInput } from 'react-native-web'
import { TouchableOpacity, Image } from 'react-native-web'
import { Tooltip } from '@material-ui/core';

{/*
    This component is the first interface that the user sees when he's logged in
    Here are its components:
        * HistoryVideo:
          - it is an element of the history, that is to say a video
          - it displays the image associated to the video and the title
          - to go to the video, click on the title
          - props: title and ID of a video
          - if the history is empty, a message is rendered 
        * Header:
          - this is a component from where you can logout, go back to the dasboard and edit your profile
*/}

const HistoryVideo = props => {
  return (
      <div className="historyVideoContainer">
        <Tooltip title="Open Video">
          <Link className="testText"  numberOfLines={2} to={`/app/${props.video_id}/${props.video_title}`}>
            <Image
              source={{uri: "http://img.youtube.com/vi/"+props.video_id+"/mqdefault.jpg"}} 
              style={{
                width: 200, 
                height: 110 , 
                border: '2px solid',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            {props.video_title}
          </Link> 
        </Tooltip> 
      </div>
  )
}
export default class Dashboard extends React.Component {
    state = {
      // the videos already watched by the user
      userHistory: {
        video_urls: null,
        video_titles: null
      },
      // loading of the info got with the back end
      loading: true,
      // list of the videos available in the app
      catalog: [],
      // content of a research in the catalog
      searchString: '',
      // result of the research in the catalog
      searchResult: []
    }

    static contextType = TokenContext

    // returns the videos already wtached by the user
    async getHistoryRequest() {
      
      let response=null
        try{
          response = await fetch('/api/get_user_history', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(this.context.token+':unused')
              },
            })
            .then(handleFetchHttpErrors)
            .then(res => res.json())
        }
        catch(err){
          console.log(err)
          if(err.message==="401"){
              
              //alert('Your session have expired, please re-login')
              this.context.setToken('')
              
              return <Redirect to="/" />
          }
          else  {
              alert('Unknown Error')
              return
          }
        }
        console.log("response",response)
        if(response===undefined){
          alert('Unknown Server Error')
          return
        }
        else{
          this.setState({userHistory: {video_urls: response.videoHistory, video_titles: response.videoHistoryTitles}, loading: false})
      }
    }

    // returns the list of the videos available in the catalog
    async getCatalog() {
      let response=null
        try{
          response = await fetch('/api/get_catalog', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(this.context.token+':unused')
              },
            })
            .then(handleFetchHttpErrors)
            .then(res => res.json())
        }
        catch(err){
          console.log(err)
          if(err.message==="401"){
              
              this.context.setToken('')
              return <Redirect to="/" />
          }
          else  {
            
              alert('Unknown Error')
              return
          }
        }
        console.log("response",response)
        if(response===undefined){
          alert('Unknown Server Error')
          return
        }
        else{
          this.setState({catalog: response.catalog})
      }
    }

    async componentDidMount() {
        this.getHistoryRequest();
        this.getCatalog();
      }


    // handle the research in the catalog
    handleChange = (event) => {
      const {catalog} = this.state;
      this.setState({searchString: event.target.value});
      const searchString = event.target.value.trim().toLowerCase();
      let result = [];
      if(searchString.length > 0){
        result = catalog.filter(video => 
          video.title.toLowerCase().match( searchString )
        );
      }
      if(result.length){
        this.setState({searchResult: result});
      } else {
        this.setState({searchResult: []});
      }
    }
  
    render() {
      const { video_urls, video_titles } = this.state.userHistory;
      const { catalog, loading, searchString, searchResult } = this.state;      
      const { nameSurname } = this.context;
      
    return (
      
      <div style={{height: 'auto', display: 'flex', flexDirection: 'column'}}>
        <Header page="dashboard" login={nameSurname}/>
        <div className="welcomeDashboardContainer">
            <text className="welcomeDashboard">
                Welcome to your EDURELL dashboard!
            </text>
            <div className="catalogContainer">
              <TextInput 
                type="text"
                value={searchString}
                onChange={this.handleChange}
                placeholder="Search for videos within the catalog"
                placeholderTextColor="#5B5B5B"
                style={{color: '#5B5B5B', fontWeight: 'bold', width: '100%'}}
              />
              <GoSearch size={20} color='#5B5B5B'/>
            </div>
            <div>
              {
                !searchString || !searchResult.length
                ? null
                : <div style={{height: 2.75*17*searchResult.length}} className="catalog">
                  <ScrollView style={{height: '100%', width: '100%'}}>
                      { searchResult.map(h => {
                        return <Tooltip title="Open Video">
                                    <Link className="testText" to={`/app/${h.video_id}/${h.title}`} style={{textAlign: 'left'}}>{h.title}</Link>
                                </Tooltip>}
                      ) }
                  </ScrollView>
                  </div>
              }
            </div>
        </div>

        {loading
              ? null
              : video_urls.length && video_titles.length
                ? <div className="historyContainer">
                    <text className="historyTitle">
                        Your history
                    </text>
                    <div className="historyContent">
                    <ScrollView horizontal={true} style={{width: '100%', height: '100%'}}>                 

                          {video_urls.map(h => {
                          // get video id
                          let video_id = h.video_url.split("watch?v=")[1];
                          // get video title
                          let video_title = video_titles[video_urls.indexOf(h)]
                          return <HistoryVideo
                                    video_id={video_id}
                                    video_title={video_title}
                                  />
                        })} 
          
                        </ScrollView>
                    
                    </div>
                </div>
                : null 
          }

        <div className="historyContainer">
            <text className="historyTitle">
                Videos
            </text>
            <div className="historyContent" style={{paddingBottom:'5%'}}>
            {loading
              ? null
              :  <ScrollView horizontal={true} style={{width: '100%', height: '100%'}}>

                  {catalog.map(v => {
                      // get video id
                      let video_id = v.video_id;
                      // get video title
                      let video_title = v.title
                      return <HistoryVideo
                                video_id={video_id}
                                video_title={video_title}
                              />
                  })}    
   
         
                </ScrollView>
            }
            </div>
        </div>

  </div>
  );}
}