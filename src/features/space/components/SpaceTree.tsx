import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { ChevronRight, Folder as FolderIcon, List as ListIcon, Plus } from 'lucide-react'
import { useSpaces } from '../api/useSpaces'
import { useFolders } from '../api/useFolders'
import { useLists } from '../api/useLists'
import { CreateSpaceModal } from './CreateSpaceModal'
import type { Space } from '../../../types'
import { CreateListModal } from './CreateListModal'
import { EditSpaceModal } from './EditSpaceModal'
import { DeleteSpaceDialog } from './DeleteSpaceDialog'

export function SpaceTree({ workspaceId }: { workspaceId: string }) {
  const { data, isLoading } = useSpaces(workspaceId)
  const [modalOpen, setModalOpen] = useState(false)
  const spaces = data?.data ?? []

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Spaces
        </span>
        <button
          onClick={() => setModalOpen(true)}
          className="h-5 w-5 flex items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
        >
          <Plus size={13} />
        </button>
      </div>

      {isLoading ? (
        <div className="px-2 py-3">
          <span className="h-4 w-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin inline-block" />
        </div>
      ) : spaces.length === 0 ? (
        <button
          onClick={() => setModalOpen(true)}
          className="mx-2 px-2.5 py-2 rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-left"
        >
          + Create your first space
        </button>
      ) : (
        spaces.map((space) => (
          <SpaceNode key={space.id} workspaceId={workspaceId} space={space} />
        ))
      )}

      <CreateSpaceModal workspaceId={workspaceId} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function SpaceNode({ workspaceId, space }: { workspaceId: string; space: Space }) {
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)
    const [listModalOpen, setListModalOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const { data: foldersData } = useFolders(workspaceId, space.id)
    const { data: listsData }   = useLists(workspaceId, space.id)

    const folders   = foldersData?.data ?? []
    const allLists  = listsData?.data ?? []
    const rootLists = allLists.filter((l) => !l.folder_id)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setMenuOpen(false)
        }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

  return (
    <div>
      <div className="flex items-center group">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[var(--color-base-200)] transition-colors text-left"
        >
          <i
            className="fi fi-rr-angle-small-right text-[var(--color-base-content)] opacity-50 shrink-0 transition-transform"
            style={{ fontSize: '13px', transform: expanded ? 'rotate(90deg)' : 'none' }}
          />
          <div
            className="h-4 w-4 rounded flex items-center justify-center shrink-0"
            style={{ backgroundColor: space.color }}
          >
            <span className="text-[9px] font-bold text-white">{space.name.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-sm text-[var(--color-base-content)] truncate">{space.name}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setListModalOpen(true)
          }}
          className="h-6 w-6 shrink-0 flex items-center justify-center rounded-md text-[var(--color-base-content)] opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-[var(--color-base-200)] transition-all"
          title="Add list"
        >
          <i className="fi fi-rr-plus" style={{ fontSize: '12px' }} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className="h-6 w-6 shrink-0 flex items-center justify-center rounded-md text-[var(--color-base-content)] opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-[var(--color-base-200)] transition-all mr-1"
            title="Space options"
          >
            <i className="fi fi-rr-menu-dots" style={{ fontSize: '12px' }} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-7 w-40 rounded-xl border border-[var(--color-border)] shadow-lg py-1.5 z-50"
              style={{ backgroundColor: 'var(--color-base-100)' }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setEditModalOpen(true)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-base-content)] hover:bg-[var(--color-base-200)] transition-colors"
              >
                <i className="fi fi-rr-pencil" style={{ fontSize: '13px' }} />
                Edit
              </button>
              {/*<button
                onClick={() => {
                  setMenuOpen(false)
                  setDeleteDialogOpen(true)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-base-200)] transition-colors"
              >
                <i className="fi fi-rr-trash" style={{ fontSize: '13px' }} />
                Delete
              </button>*/}

              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate({ to: '/workspaces/$workspaceId/spaces/$spaceId/settings', params: { workspaceId, spaceId: space.id } })
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-base-content)] hover:bg-[var(--color-base-200)] transition-colors"
              >
                <i className="fi fi-rr-settings" style={{ fontSize: '13px' }} />
                Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="ml-5 pl-2 border-l border-[var(--color-border)] flex flex-col gap-0.5 mt-0.5">
          {folders.map((folder) => (
            <FolderNode
              key={folder.id}
              workspaceId={workspaceId}
              spaceId={space.id}
              folder={folder}
              lists={allLists.filter((l) => l.folder_id === folder.id)}
            />
          ))}

          {rootLists.map((list) => (
            <ListLink key={list.id} workspaceId={workspaceId} spaceId={space.id} list={list} />
          ))}

          {folders.length === 0 && rootLists.length === 0 && (
            <p className="text-xs text-[var(--color-base-content)] opacity-50 px-2 py-1.5">Empty space</p>
          )}
        </div>
      )}

      <CreateListModal
        workspaceId={workspaceId}
        spaceId={space.id}
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
      />
      <EditSpaceModal
        workspaceId={workspaceId}
        space={space}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteSpaceDialog
        workspaceId={workspaceId}
        space={space}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  )
}

function ListLink({
  workspaceId,
  spaceId,
  list,
}: {
  workspaceId: string
  spaceId: string
  list: { id: string; name: string; color: string }
}) {
  return (
    <Link
      to="/workspaces/$workspaceId/spaces/$spaceId/lists/$listId"
      params={{ workspaceId, spaceId, listId: list.id }}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
    >
      <ListIcon size={13} style={{ color: list.color }} className="shrink-0" />
      <span className="text-sm text-[var(--color-text)] truncate">{list.name}</span>
    </Link>
  )
}
