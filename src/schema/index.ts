export const typeDefs = `#graphql
    scalar JSON

    type Mutation {
        createLandmark(
            name: String!,
            category: String!,
            latitude: String!,
            longitude: String!
        ): Landmark

        deleteLandmark(
            id: ID!
        ): Landmark
        
        createFloor(
            landmarkId: ID!,
            level: String!,
            name: String!,
        ): Floor

        updateFloor(
            id: ID!
            landmarkId: ID!
            level: String!
            name: String!
        ): Floor!

        deleteFloor(
            id: ID!
            landmarkId: ID!
        ): Boolean!

        createFloorPlanWithAreas(
            floorId: ID!
            pathname: String!
            areas: [FloorPlanAreaInput!]
        ): FloorPlan!

        updateFloorPlanWithAreas(
            floorPlanId: ID!
            pathname: String
            areas: [FloorPlanAreaInput]
        ): FloorPlan

        # createFloorPlan(
        #     floorId: ID!,
        #     pathname: String!
        # ): FloorPlan!

        # createFloorPlanArea(
        #     floorPlanId: ID!,
        #     x: String!,
        #     y: String!,
        #     pageNumber: Int!,
        #     details: JSON!
        # ): FloorPlanArea

        # updateFloorPlanArea(
        #     landmarkId: ID!
        #     floorId: ID!
        #     areas: [UpdateFloorPlanAreaInput!]!
        # ): [FloorPlanArea]!
    }

    type Query {
        getLandmarks: [Landmark!]!
        getLandmarkById(id: ID!): Landmark
        getFloorByLevelId(landmarkId: ID!, levelId: String!): Floor
    }

    type FloorPlanAreaDetail {
        name: String!
        description: String!
        createdAt: String!
        updatedAt: String!
    }

    type FloorPlanArea {
        id: ID!
        x: String!
        y: String!
        pageNumber: Int!
        details: FloorPlanAreaDetail!
        createdAt: String!
        updatedAt: String!
    }

    type FloorPlan {
        id: ID!
        pathname: String!
        floorId: ID!
        areas: [FloorPlanArea]
        createdAt: String!
        updatedAt: String!
    }


    type Floor {
        id: ID!
        level: String!
        name: String!
        landmarkId: ID!
        floorPlans: [FloorPlan]
        createdAt: String! 
        updatedAt: String!
    }

    type Landmark {
        id: ID!
        name: String!
        category: String!
        latitude: String!
        longitude: String!
        floors: [Floor]
        createdAt: String!
        updatedAt: String!
    }

    # input UpdateAreaDetailsInput {
    #     name: String!
    #     description: String!
    # }

    # input UpdateFloorPlanAreaInput {
    #     id: ID
    #     x: String!
    #     y: String!
    #     pageNumber: Int!
    #     details: UpdateAreaDetailsInput!
    # }

    input FloorPlanAreaDetailInput {
        name: String
        description: String
    }
    
    input FloorPlanAreaInput {
        x: String!
        y: String!
        pageNumber: Int!
        details: FloorPlanAreaDetailInput
    }
`;
