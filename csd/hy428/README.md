# Contents

1. [LEGO](#example)
    1. hello
3. [Virtualization](#Virtualization)
4. [ARM](#third-example)
5. [Virtualization](#Virtualization)
    1. 

# Virtualization

## Virtualization vs Emulation

Emulation is the ability to be able to emulate or reproduce the behavior of any instruction from any architecture on top of our system. For example, running any instruction from the ARM ISA on a system with x86 ISA would require special emulation software that can reproduce the behavior of every ARM instruction by either emulating the CPU or by using x86 instructions.

Virtualization is the process of assisting a Virtual Machine that runs on the same architecture by using our hardware's assistance instead of emulating every instruction.

## Privilege Levels

Privilege Levels or Rings exist to guard the information that would otherwise be sharable between procedures and kernel calls. For example, if a syscall used the same stack as a normal procedure, that would be a huge security issue as. 

To defend against that, kernel procedures that are sensitive run on a priviledged level called Ring 0. On the other hand, userland applications that are not trusted should be executed in Ring 3. Communication between Rings should only be done using Kernel traps, or syscalls.

Ring 0 - Kernel\
Ring 3 - Userland\
Ring 1 and 2 are usually unused.

![](img/rings.png)

Different Ring levels use completely different stacks - a transition between Rings is always accompanied by a "stack-switch" operation.

## Classic Virtualization Theorems

### Instruction Types

1. PI - Privileged Instructions: Execute in kernelmode, trap in usermode
2. PS - Privileged State: 
3. SI - Sensitive Instructions: Behavior depends on current Ring

### Theorem 1

A VMM may be constructed if the set of SI's is a subset of the set of PI's

![](img/theorem1.png)


The problem is that not all of X86's sensitive instructions are privileged instructions. This means that resource modification can occur without the VMM seeing and handling it which can be dangerous. Alternatively, it could mean executing an instruction within the guest operating system in user mode and seeing a different effect than having executed it in system mode. According to this paper there are seventeen instructions in x86 that are sensitive but are not privileged. One example is POPF when has different semantics depending on the machine's mode.

## Trap and Emulate

Operating systems are made with the idea of having all the hardware to themselves. Obviously, this can't work with Virtualization as we would like multiple OS to run at the same time without interfering with each other.

Thus, the hypervisor can detect wether an OS is trying to do something that would affect another OS and emulate that behavior instead of letting it run on the hardware. By doing that, the hypervisor can decide what the behavior of the instruction will be and protect the integrity of other OS's.

For example, OS A and OS B both try to draw on the screen using the GPU. Instead of letting them have full control of the screen, we can instead trap and emulate those calls to draw both, or one of the images on the screen:

![](img/trap_and_emulate.png)

## Binary Translation

## Hardware-Assisted Virtualization

## Para-Virtualization
Reduces number of traps
Remove un-virtualizable instructions

## Hypervisor Types

1. Type I - Run directly on hardware\
    Type I hypervisors run bare-metal on hardware, just like a bootloader or an operating system would. Examples of Type I hypervisors are:\
    ```XEN, Hyper-V, IBM LPAR, ESXi```
2. Type II - Run on host OS\
    Type II hypervisors run on a pre-existing operating system, just like actual software they are userspace processes. Examples of Type II hypervisors are:\
    ```VMWare, VirtualBox, KVM, QEMU```

## Key Techniques

1. De-Privileging\
    Hypervisors emulate the effect on hardware resources requested by privileged guest instructions (Trap and Emulate). Usually achieved by running the guest at a lower hardware priority level than the hypervisor. ```Execute normal instructions, trap privileged ones. ```
2. Shadow Structures\
    The hypervisor keeps a safe copy of critical structures () that the guest will modify. This is both for security and to ensure each guest gets a correct environment. For example, for the page tables:
    ![](img/shadow.png)

3.

## Process VM

Process emulation allows us to execute an executable that is made for an architecture different than the one we are running on, by encapsulating the virtual process and presenting it as a normal one to us.

Example:\
```qemu-user```

# Binary Translation

## Static Binary Translation

Difficulties with static translation:
1. Code Identification
2. Polycode
3. Precise Exceptions\
    TLB Miss -> Exception -> Different Implementations / arch

## The problem

Dynamic Binary Translation combines emulation and translation to overcome the difficulties of identifying what is code and what not statically. Since we would like to group instructions together, we want the groups to consist of instructions that do not include any control flow change (jmp, call, ret). Considering the following example, this is very easy statically:

```
push    ebp
mov     eax,    1
add     eax,    50
...
xor     eax,    eax
jmp     0x6d7bef
```

We could group everything from ```push ebp``` to ```xor eax eax``` in a block, since they contain no control flow changes. Then we could go to 0x6d7bef and analyze the next block.

However, a binary will not always look like this. For example, consider the following program that dynamically pulls an address of a switch table then jumps to it:

```
move    edx,    [ebp-4]
add     edi,    edx
mov     rax,    [edi]
jmp     rax
```

Here, we can again group the instructions before the jmp together, but the problem comes when we would like to analyze the next block. Statically, we can never know what the value of rax might be, and thus we would have to take every possible value and analyze it without knowing if its code or not, which is impossible.

To overcome that, we instead emulate the program, executing each instruction. By doing that, we will know the runtime value (one of them) of rax at that point, and thus we will be able to analyze a piece of data that is actually code. 

## Dynamic Binary Translation

DBT in its core is a few simple steps that allow us to group those important instructions into blocks and depending on their importance be able to execute them faster. For example, if a bunch of instructions are being executed constantly, instead of emulating them one by one, we could just compile them into native code for our architecture and then inject that native code every time we come across them.

The DBT process is as follows:
1. Emulate the next instruction, add it to the current group
2. Have we found a jmp, call or ret?
    - If yes, go to 3
    - If no, go to 1 and keep emulating
3. Since we found a control flow change, wrap up the current group. We now have a basic block
4. Emulate the control flow change (jmp) and reach the first new instruction.
5. Have we been here before?
    - If yes, this is a group

```c
while(true){

    curr_instruction = next_instruction()

    if(curr_instruction != 'jmp'){
        emulate_instruction(curr_instruction)
        current_block.append(curr_instruction)
        continue;
    }

    // We found a jmp, thus we close the basic block
    known_blocks.append(current_block)
    current_block = new()

    // Emulate the jmp so we arrive to the next block
    emulate_instruction(curr_instruction)
    

}
```



