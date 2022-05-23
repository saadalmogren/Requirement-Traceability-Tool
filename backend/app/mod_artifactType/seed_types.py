from app.mod_artifactType.models import Artifact_Type
def seed_types(pID):
    """Seed the database."""
    p1 = Artifact_Type(name = 'Business need', description="Business needs are gaps between the current state of a business and its goals.", project_name= pID)
    p1.insert()

    p2 = Artifact_Type(name = 'Source', description="A person who initiate the business need.", project_name= pID)
    p2.insert()

    p3 = Artifact_Type(name = 'Feature', description = "feature is a slice of business functionality that has a corresponding benefit or set of benefits for that product's end user.", project_name= pID)
    p3.insert()

    p4 = Artifact_Type(name = 'Requirement', description="a software capability needed by the user to solve a problem to achieve an objective.", project_name= pID)
    p4.insert()

    p5 = Artifact_Type(name = 'Use case', description="a use case describes sequences of actions that a system performs that yield an observable result of value to a particular actor.", project_name= pID)
    p5.insert()

    p6 = Artifact_Type(name = 'Analysis class diagram', description="a diagram that contains all classes that participate in a sequence diagram or that implement a use case.", project_name= pID)
    p6.insert()

    p7 = Artifact_Type(name = 'Sequence diagram', description="a diagram that describe the dynamic behavior between actors and the system and between objects of the system.", project_name= pID)
    p7.insert()

    p8 = Artifact_Type(name = 'Activity diagram', description="a diagram that describes the behavior of a system in terms of activities", project_name= pID)
    p8.insert()

    p9 = Artifact_Type(name = 'User interface', description="is the means in which a person controls a software application or hardware device.", project_name= pID)
    p9.insert()

    p10 = Artifact_Type(name = 'Design Class diagram', description="a diagram that describes the static structure of the system in terms of Objects, Attributes, Associations, and Operations.", project_name= pID)
    p10.insert()

    p11 = Artifact_Type(name = 'Deployment diagram', description="a diagram that describes system hardware, software and network connections.", project_name= pID)
    p11.insert()

    p12 = Artifact_Type(name = 'Method', description="a method is a subroutine attached to a specific class defined in the source code of a program.", project_name= pID)
    p12.insert()

    p13 = Artifact_Type(name = 'Class', description="a class is a blueprint or prototype from which objects of the same type are created.", project_name= pID)
    p13.insert()

    p14 = Artifact_Type(name = 'Test case', description="a test case is a small unit of code that tests a specific method.", project_name= pID)
    p14.insert()

