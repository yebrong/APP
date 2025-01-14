import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Text, View, Image, TextInput, SafeAreaView,Platform,TouchableOpacity, ScrollView,StyleSheet, Animated, ActivityIndicator, ImageBackground} from 'react-native';
import Images from '../../constants/images';
import styled from 'styled-components/native';
import Fonts from '../../constants/fonts';
import {Commenter, PostCommenter} from './Comment/Comment';
import { useRecoilValue, useRecoilState } from 'recoil';
import { tokenState,emailState } from '../../atoms/authAtom';
import {likeState, todayState, taggingState, profileState} from '../../atoms/communityAtom';
import {makeApiRequest} from '../../utils/api';
import { Post,Comment } from '../../types/community';
import {communityProp} from '../../types/community';
import { useNavigation } from '@react-navigation/native';
import LikeButton from './Like/LikeButton';
import PostReport from './Report/PostReport';
import {GetElement} from '../Home/HomePage';

const CommunityDetail= ({route,navigation}: communityProps) => {
    const [taggedWriter,setTaggedWriter] = useRecoilState(taggingState);
    const [postModalVisible, setPostModalVisible] = useState(false);
//     const [userProfile, setUserProfile] = useRecoilState(profileState);
    const [writer, setWriter] = useState<string>('');
    const loggedInUserEmail = useRecoilValue(emailState);
      const today = useRecoilValue(todayState);
  const tokens = useRecoilValue(tokenState);
         const accessToken= 'Bearer '+tokens.accessToken;
         const [isLiked, setIsLiked] = useRecoilState(likeState);
         const [commentSum, setCommentSum] = useState<Comment[]>([]);

    const [diaryData, setDiaryData] = useState<Post | null>(null);
    const diaryId = route.params?.diaryId;
    const [isLoading, setIsLoading] = useState(true);
    const [isWriter, setIsWriter] = useState(false);

    const closeModal =()=>{
        setPostModalVisible(false);
        }
const goToCommentList = (post) => {
    setTaggedWriter('');
  navigation.navigate('CommentPage',{post});
};




    const fetchDiaryData = useCallback(async () => {

        console.log("fetch Diary Data Start");
        if (diaryId !== undefined) {
            try {
                console.log("diary:" + diaryId);

                const response = await fetch(`http://ec2-3-38-253-190.ap-northeast-2.compute.amazonaws.com:9090/api/public-diaries/${diaryId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': accessToken,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("diary content:"+JSON.stringify(data));
                    const post: Post = {
                        id: data.data.publicDiaryId,
                        writer: data.data.author.nickname,
                        writerEmail: data.data.author.userEmail,
                        writerProfile: data.data.author.profilePhotoUrl || '',
                        title: data.data.title,
                        content: data.data.content,
                        date: data.data.createdAt.split("T")[0],
                        time: data.data.createdAt.split("T")[1],
                        photoUrl: data.data.photoUrl,
                        views: data.data.views,
                        favoriteCount: data.data.likes,
                    };
                 setWriter(data.data.author.userEmail);
                    setDiaryData(post);
                    console.log("who are u"+loggedInUserEmail);
                   if(loggedInUserEmail === data.data.author.userEmail ){

                       setIsWriter(true);
                       } else{
                           setIsWriter(false);
                           }
                    console.log("작성자는"+writer);

                    console.log("setDiary:" + JSON.stringify(post));
                }
            } catch (error) {
                console.error('Failed to fetch diary:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.error('diaryId is undefined');
            setIsLoading(false);
        }
    }, [diaryId]);

useEffect(() => {
        fetchDiaryData();
         updateTopTwoComments();// diaryId가 변경될 때마다 호출
    }, [diaryId]);

const goBack = () => {
     setTaggedWriter('');
    navigation.goBack();
  };


const updateTopTwoComments = async () => {
                                 try {
                                     const response = await fetch(`http://ec2-3-38-253-190.ap-northeast-2.compute.amazonaws.com:9090/api/public-diaries/${diaryId}/comments`, {
                                         method: 'GET',
                                         headers: {
                                             'Authorization': accessToken,
                                             'Content-Type': 'application/json'
                                         }
                                     });

                                     if (response.ok) {
                                         const data = await response.json();
                                         const elements = data.data.elements;
                                         const formattedData: Comment[] = elements.map((item: any) => ({
                                             id: item.publicDiaryCommentId,
                                             date: item.createdAt,
                                             updatedDate: item.updatedAt,
                                             content: item.content,
                                             writer: item.author.nickname,
                                             writerEmail: item.author.userEmail,
                                             writerProfile: item.author.profilePhotoUrl,
                                             likes: item.likes,
                                             commentPostId: null,
                                         }));

                                    const sortData =  formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                         setCommentSum(sortData);

                                     }
                                 console.log("community Detail");

                                 } catch (error) {
                                     console.error('Failed to fetch comments:', error);
                                 }
                             };



const deletePost = async ()=> {
    try {
                                         const response = await fetch(`http://ec2-3-38-253-190.ap-northeast-2.compute.amazonaws.com:9090/api/public-diaries/${diaryId}`, {
                                             method: 'DELETE',
                                             headers: {
                                                 'Authorization': accessToken,
                                                 'Content-Type': 'application/json'
                                             }
                                         });

                                         if (response.ok) {
                                            console.log("delete done");
                                            goBack();
                                            }
                                     } catch (error) {
                                         console.error('Failed to fetch comments:', error);
                                     }
    }



const splitContent = (content) => {
  if (content.length <= 26) {
    return [content]; // 28자 이하인 경우 그대로 반환
  }

 if(content.length>26 && content.length<=53){
      const firstPart = content.slice(0, 26); // 처음 28자
       const secondPart = content.slice(26); // 나머지 문자열
       return [firstPart,secondPart]
     }

if(content.length>53 && content.length<=80){
   const firstPart = content.slice(0, 26); // 처음 28자
          const secondPart = content.slice(26,53); // 나머지 문자열
          const thirdPart = content.slice(53);
          return [firstPart,secondPart, thirdPart]
    }

if(content.length>80){
  const firstPart = content.slice(0, 26); // 처음 28자
           const secondPart = content.slice(26,53); // 나머지 문자열
           const thirdPart = content.slice(53,80);
           const fourthPart = content.slice(80);
           return [firstPart,secondPart, thirdPart, fourthPart]
    }

};

const contentLines = diaryData && diaryData.content ? splitContent(diaryData.content):[];

    return (
        <ImageBackground
                style={{height: '100%'}}
                resizeMode={'cover'}
                source={Images.backgroundImage}>
                <View style={{marginTop:5, height:25, width:"100%"}}>
               <TouchableOpacity onPress={goBack}>
               <Images.Back/>
                       </TouchableOpacity></View>
                    <PostHeaderView>
{diaryData? (<><PostTextBox>
                                   <PostText style={{fontSize:30}}>{diaryData.date.split("-")[1]}월 {diaryData.date.split("-")[2]}일 </PostText>
                                   <PostText style={{fontSize:20}}>{diaryData.time.split(":")[0]}:{diaryData.time.split(":")[1]}</PostText>

                                   </PostTextBox>

                                   <PostProfileBox>
                                    <PostTextBox style={{width:"50%", marginRight:30}}>

                                   <UserNickname data={diaryData}/>

                                   </PostTextBox>
                                 {isWriter? <DeleteButton onPress={deletePost}><PostText style={{marginTop:2}}>삭제</PostText></DeleteButton> : <UnDeleteButton></UnDeleteButton>}
                                   </PostProfileBox></>):(<><Text>데이터가 존재하지 않습니다</Text></>)}

                    </PostHeaderView>

                   <DetailView>
                           {isLoading ? (
                             <ActivityIndicator size="large" color="#0000ff" />
                           ) : diaryData ? (
                             <>
                             <Images.Clip  style={{ marginTop: -10, left: "50%" }}/>
                               <PostText style={{ marginTop: 10, fontSize: 20 }}>{diaryData.title}</PostText>
                               <PostLine />
                               <PostImage source={{ uri: diaryData.photoUrl }} />
                                {contentLines.map((line, index) => (
                                     <PostContent key={index}>{line}</PostContent>
                                   ))}
                             </>
                           ) : (
                             <Text>데이터를 찾을 수 없습니다.</Text>
                           )}
                         </DetailView>

                    <ButtonBox>
                                        <TouchableOpacity onPress={()=>goToCommentList(diaryData)}>
                    <Images.Comment/>
 </TouchableOpacity>
                    <PostReport diaryId={diaryId}
                    visible={postModalVisible} accessToken={accessToken} onClose={closeModal}/>

                          <LikeButton diaryId={diaryId} accessToken={accessToken}/>


                    </ButtonBox>
                     <CommentWriteBox accessToken={accessToken} updateTopTwoComments={updateTopTwoComments} diaryId={diaryId}/>
                    <CommentBox>
                     {commentSum.length > 0 ? (
                            commentSum.map(data => {
                                const isPostWriter = diaryData && data.writer === diaryData.writer;

                                return isPostWriter ? (
                                    <PostCommenter key={data.id} accessToken={accessToken} data={data} user={loggedInUserEmail} />
                                ) : (
                                    <Commenter key={data.id} accessToken={accessToken}  data={data} user={loggedInUserEmail} />
                                );
                            })
                        ) : (
                            <PostText style={{fontSize:20}}>댓글을 남겨 보세요</PostText>
                        )}
                    </CommentBox>
                </ImageBackground>
        );
    };
//
// export const goToUserProfile = (post:Post) =>{
//                  navigation.navigate('CommunityProfile',{post});
//                  };


export const UserNickname = (data)=>{

const navigation = useNavigation();
console.log("data:"+JSON.stringify(data));
console.log("this type is "+typeof data);
console.log(data.data.writer);
const goToUserProfile = (data) =>{
                 navigation.navigate('CommunityProfile',data);
                 };

 return (
     <TouchableOpacity onPress={() => goToUserProfile(data)}>

         {typeof data === 'object' && 'updatedDate' in data.data ? (
             <View>
             <Icon style={{ left:10, width:55, height:55 }} source={{ uri: data.data.writerProfile }} />
                 <PostText style={{ margin: "0 auto", fontSize: 10 }}>
                     {data.data.writer}
                 </PostText>
             </View>
         ) : (
             <View>
             <Icon style={{ marginLeft: 15 }} source={{ uri: data.data.writerProfile }} />
                 <PostText style={{ top: -20, fontSize: 15 }}>
                     {data.data.writer}
                 </PostText>
             </View>
         )}
     </TouchableOpacity>
 );

    }

export const CommentWriteBox = ({accessToken, refreshComments,updateTopTwoComments,diaryId})=>{
    const [taggedWriter, setTaggedWriter] = useRecoilState(taggingState);
    const parentWriter = useRecoilValue(taggingState).writer;

    const [isTagged, setIsTagged] = useState(false);
    const [writeValue, setWriteValue]=useState<string>('');

useEffect(()=>{
    if(taggedWriter !== null){
        setIsTagged(true);
        }

    if(parentWriter !== ''){
        console.log("tag:"+taggedWriter);
        }
    },[]);

   const sendComment = () =>{

       if(writeValue.trim()===''){
          console.log('입력하지 않았습니다.');
           return;
           }

       const send = async () => {
  if(!isTagged){


           try{
                        const request = await fetch (`http://ec2-3-38-253-190.ap-northeast-2.compute.amazonaws.com:9090/api/public-diaries/${diaryId}/comments`,{
                       method:'POST',
                        body:JSON.stringify({
                            content: writeValue}),
                        headers:{
                                    'Authorization': accessToken,
                                    'Content-Type': 'application/json',
                                    },
                        })

                        if(request.ok){
                        console.log(JSON.stringify(request));
                                            if (typeof refreshComments === 'function') {
                                                                                await refreshComments();
                                                                            }
                                                                                            if (typeof updateTopTwoComments === 'function') {
                                                                                               await updateTopTwoComments();
                                                                                            }


                             }
                        } catch(error){
                            console.error(error);};
           } else if(isTagged){
               console.log("isTagged:"+taggedWriter.id);
               console.log("isTagged:"+diaryId);
               const parentCommentId = taggedWriter.id;


                 try{
                              const request = await fetch (`http://ec2-3-38-253-190.ap-northeast-2.compute.amazonaws.com:9090/api/public-diaries/${diaryId}/comments/${parentCommentId}`,{
                             method:'POST',
                              body:JSON.stringify({
                                  content: writeValue}),
                              headers:{
                                          'Authorization': accessToken,
                                          'Content-Type': 'application/json',
                                          },
                              })

                              if(request.ok){
                                console.log(diaryId);
                                                  if (typeof refreshComments === 'function') {
                                                                                      await refreshComments();
                                                                                  }
                                                                                                  if (typeof updateTopTwoComments === 'function') {
                                                                                                     await updateTopTwoComments();
                                                                                                  }


                                   }
                              } catch(error){
                                  console.error(error);};
               }

           };
      send();
       setWriteValue('');

       };

const deletePress = (event) => {
    // Backspace 키가 눌렸고 writeValue가 빈 문자열일 때 taggedWriter를 빈 문자열로 설정
    if ( event.nativeEvent.key === 'Backspace' && writeValue === '') {
        console.log("backback");
        setTaggedWriter('');
        console.log("tag:"+taggedWriter);
    }
};
const handleChangeText = (text) => {
     setWriteValue(text);
  if (text.length < writeValue.length) {
    // 텍스트가 삭제되었을 때
    if (text === '') {
      // 모든 텍스트가 삭제되었을 때
      setTaggedWriter('');
      setIsTagged(false);
      console.log("backback");
      console.log("tag:" + taggedWriter);
    }
  }

};
    return (
        <CommentInputView>
            {isTagged ? (
                <>
                    <Text
                        multiline={true}
                        style={{
                            width: 100,
                            fontFamily: `${Fonts.MapoFont}`,
                            fontSize: 10,
                            textAlign: 'center',
                            color: 'black',
                            marginTop: 8,
                        }}
                    >
                        {parentWriter}
                    </Text>
                    <CommentInput
                        onKeyPress={deletePress}
                        style={{ left: -80, width: 190 }}
                        value={writeValue}
                        onChangeText={handleChangeText}
                    />
                </>
            ) : (
                <>
                    <CommentInput
                      onKeyPress={deletePress}
                        value={writeValue}
                        onChangeText={handleChangeText}
                    />
                </>
            )}
            <CommentBtn onPress={sendComment} title="send">
                <BtnText>write</BtnText>
            </CommentBtn>
        </CommentInputView>
    );


    };

const DeleteButton = styled.TouchableOpacity`
width:50px;
height:20px;
background-color:#E5DECA;
border-radius:5px;
margin-top:15px;
`;

const UnDeleteButton = styled.View`
width:50px;
height:20px;
border-radius:5px;
margin-top:15px;
`;
const CommentBox = styled.View`
width:90%;
top:50px;
margin: 0 auto;
height:150px;
border-radius:20px;
`;
const CommentInputView = styled.View`
top: 40px;
flex-direction: row;
    justifyContent: space-between;
width:90%;
margin:0 auto;
border-radius:10px;
font-size: 10px;
background-color:white;
height: 35px;
border-bottom-width: 4px;
 border-bottom-color: #C2D0CF;
color:black;
`;
const CommentInput = styled.TextInput`
width: 280px;
position:relative;
font-family: ${Fonts.MapoFont};
font-size:8px;
height:35px;
left:10px;
font-size:15px;
color: black;
`;
const BtnText = styled.Text`
width: 65px;
height:31px;
font-size: 15px;
font-family: ${Fonts.MapoFont};
text-align: center;
margin-top: 5px;
`;
const CommentBtn = styled.TouchableOpacity`
  width:80px;
  position:absolute;
  right: 2px;
  border-top-left-radius:5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height:31px;
  background-color:white;
  color: #35465C;
  overflow: hidden;
  border-left-width:8px;
  border-left-color: #35465C;
  `;

const ButtonBox = styled.View`
width:90%;
margin: 0 auto;
top: 15px;
height:20px;
flex-direction: row-reverse;
justify-content: flex;
`;
const PostContent = styled.Text`
top:30px;
padding: 5px;
font-family: ${Fonts.MapoFont};
color: black;
font-size:13px;
width:80%;
margin: 0 auto;
border-bottom-width:1px;
border-bottom-color:#B0A195;
border-bottom-style:solid;
`;
const PostImage = styled.Image `
top:20px;
width: 150px;
height: 150px;
background-color:lightgray;
border-radius: 20px;
margin: 0 auto;
`;
const PostLine = styled.View`
top:5px;
width: 80%;
background-color:#B0A195;
height: 1px;
margin: 0 auto;
`;
const DetailView = styled.View`
top:10px;
position:relative;
width:90%;
height: 400px;
border-radius: 10px;
elevation:5;
margin:0 auto;
background-color:white;
`;
const Icon = styled.Image`
position:relative;
margin-top:10px;
margin-right:10px;
width: 25px;
height: 25px;
`;
const PostProfileBox = styled.View `
flex-direction: row;
justify-content: flex;
margin-top:10px;
width:80%;
margin: 0 auto;
height:50px;
`;
const PostTextBox = styled.View`
margin: 0 auto;
`;
const PostText= styled.Text`
font-family:${Fonts.MapoFont};
text-align:center;
`;
const PostHeaderView = styled.View`
width:100%;
margin-top:10px;
height:100px;
`;
export default CommunityDetail;