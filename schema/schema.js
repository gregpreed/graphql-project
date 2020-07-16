const graphql = require('graphql');
var _ = require('lodash');
const User = require('../model/user')
const Hobby = require('../model/hobby')
const Post = require('../model/post')

const{
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull

} = graphql;

// const userData = [
//     {id: '1', name: 'Greg Reed', age: 37, profession: 'VP'},
//     {id: '2', name: 'Sherry Wong', age: 27, profession: 'Engineer'},
//     {id: '3', name: 'Moonie Lantion', age: 42, profession: 'Director'},
//     {id: '4', name: 'Tatum Rehorn', age: 27, profession: 'Senior Manager'}, 
//     {id: '5', name: 'Aidan Folbe', age: 23, profession: 'Partnerships'},
// ];

// const hobbyData = [
//     {id: '1', title: 'Programming', description: 'Developers like to do this to make software', userId: '1'},
//     {id: '2', title: 'Rowing', description: 'Great college sport on the water', userId: '4'},
//     {id: '3', title: 'Swimming', description: 'Good all round exercise', userId: '3'},
//     {id: '4', title: 'Running', description: 'Run forest run', userId: '3'},
//     {id: '5', title: 'Chess', description: 'Snooze patrol', userId: '2'}
// ];

// const postData = [
//     {id: '1', comment: 'Comment 1 goes here', userId: '1'},
//     {id: '2', comment: 'Comment 2 goes here', userId: '1'},
//     {id: '3', comment: 'Comment 3 goes here', userId: '2'},
//     {id: '4', comment: 'Comment 4 goes here', userId: '3'},
//     {id: '5', comment: 'Comment 5 goes here', userId: '4'}
// ];


// Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
               // return _.filter(postData, {userId: parent.id})
               return Post.find({userId: parent.id});
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
               //return _.filter(hobbyData, {userId: parent.id})
              return Hobby.find({userId: parent.id});
            }
        }
    })

});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Documentation for hobby',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args)
            {
                console.log(parent.userId);
                return User.findById(parent.userId);
                //return _.find(userData, {id:parent.userId})
            }
        }
    })

});


const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Documentation for post',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userId);
            // return _.find(userData, {id:parent.userId})
            }
        }
    })

});


//RootQuery

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args:{id: {type: GraphQLString}},
            resolve(parent, args){

               return User.findById(args.id);

                
               // return _.find(userData, {id: args.id})
                //we resolve with data

            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
               // return userData;
               return User.find({});
            }
        },
        hobby: {
            type: HobbyType,
            args:{id: {type: GraphQLID}},
            resolve(parent, args){
                return Hobby.findById(args.id);
               // return _.find(hobbyData, {id: args.id})

            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
              //  return hobbyData;
              return Hobby.find({});
            }
        },
        post: {
            type: PostType,
            args:{id: {type: GraphQLID}},
            resolve(parent, args){
                return Post.findById(args.id);
             //   return _.find(postData, {id: args.id})

            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
             //   return postData;
             return Post.find({});
            }
        }
    }
});

//mutations

const Mutation = new GraphQLObjectType({
    name: 'Mutiation',
    fields:{
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID},
                name: {type: new graphql.GraphQLNonNull(GraphQLString)},
                age: {type: new graphql.GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });
                // save to our mongo db
                user.save();
                return user;
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new graphql.GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
              return  updatedUser = User.findByIdAndUpdate(
                  args.id, 
                  {
                    $set: {
                        name: args.name,
                        age: args.age,
                        profession: args.profession
                    }
                  }, 
                  {new: true}
                  )
            }
        },
        removeUser:{
            type: UserType,
            args: {
                id: {type: new graphql.GraphQLNonNull(GraphQLString)},
            }, 
            resolve(parent, args){
                let removedUser = User.findByIdAndRemove(
                    args.id
                ).exec();
                if(!removedUser){
                    throw new("Errors");
                }
                return removedUser;

                }

        },
        createPost: {
            type: PostType,
            args: {
                comment: {type: new graphql.GraphQLNonNull(GraphQLString)},
                userId: {type: new graphql.GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                })
                post.save();
                return post;
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new graphql.GraphQLNonNull(GraphQLString)},
                comment: {type: new graphql.GraphQLNonNull(GraphQLString)}
                //userId:{type: new graphql.GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
              return  updatedPost = Post.findByIdAndUpdate(
                  args.id, 
                  {
                    $set: {
                        comment: args.comment,
                    }
                  }, 
                  {new: true}
                  )
            }
        },
        removePost:{
            type: PostType,
            args: {
                id: {type: new graphql.GraphQLNonNull(GraphQLString)},
            }, 
            resolve(parent, args){
                let removedPost = Post.findByIdAndRemove(
                    args.id
                ).exec();
                if(!removedPost){
                    throw new("Errors");
                }
                return removedPost;

                }

        },
        createHobby: {
            type: HobbyType,
            args: {
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userId: {type: new graphql.GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                              // save to our mongo db
                return hobby.save();
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new graphql.GraphQLNonNull(GraphQLString)},
                title: {type: graphql.GraphQLNonNull(GraphQLString)},
                description: {type: graphql.GraphQLNonNull(GraphQLString)}
                //userId:{type: new graphql.GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
              return  updatedHobby = Hobby.findByIdAndUpdate(
                  args.id, 
                  {
                    $set: {
                        title: args.title,
                        description: args.description
                    }
                  }, 
                  {new: true}
                  )
            }
        },
        removeHobby:{
            type: HobbyType,
            args: {
                id: {type: new graphql.GraphQLNonNull(GraphQLString)},
            }, 
            resolve(parent, args){
                let removedHobby = Hobby.findByIdAndRemove(
                    args.id
                ).exec();
                if(!removedHobby){
                    throw new("Errors");
                }
                return removedHobby;

                }

        },
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
