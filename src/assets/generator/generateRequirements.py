
def gen_requirements(n):

    f = open("Generated_Requirements-"+str(n) + ".txt", "w")
    for i in range(1, n+1):
        f.write(f"Requirement{i}, Requirement Description{i} \n")

    f.close


n = int(input("Please enter number of requirement you want to generate: "))
gen_requirements(n)
